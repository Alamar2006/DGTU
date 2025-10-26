import json
import pickle
import numpy as np
from pathlib import Path
import requests
from typing import Dict, List, Any, Optional

class TrainedVRPSolver:
    def __init__(self, model_path='trained_vrp_model.pkl'):
        self.service_time = 10
        self.model = None
        self.scaler = None
        self.is_loaded = False
        
        # Загружаем модель при инициализации
        self.load_model(model_path)
    
    def load_model(self, model_path):
        """Загружает обученную модель и скейлер"""
        try:
            with open(model_path, 'rb') as f:
                saved_data = pickle.load(f)
                self.model = saved_data['model']
                self.scaler = saved_data['scaler']
                self.is_loaded = True
            print(f"✅ Модель успешно загружена из {model_path}")
        except Exception as e:
            print(f"❌ Ошибка загрузки модели: {e}")
            self.is_loaded = False
    
    def time_to_minutes(self, time_str):
        """Конвертирует время в формате HH:MM:SS в минуты"""
        if isinstance(time_str, str) and ':' in time_str:
            parts = time_str.split(':')
            if len(parts) == 3:
                h, m, s = parts
                return int(h) * 60 + int(m) + int(s) / 60
        return float(time_str) if time_str else 0
    
    def extract_features(self, current_point, candidate_point, matrix, current_time):
        """Извлекает фичи для ML модели"""
        features = []
        
        # Время пути
        travel_time = matrix.get(str(current_point['id']), {}).get(str(candidate_point['id']), 0)
        if isinstance(travel_time, str):
            travel_time = self.time_to_minutes(travel_time)
        features.append(travel_time)
        
        # Приоритет (VIP = 2, Standard = 1)
        priority_score = 2 if candidate_point.get('priority') == 'VIP' else 1
        features.append(priority_score)
        
        # Совместимость временных окон
        window_comp = self.calculate_window_compatibility(candidate_point, current_time)
        features.append(window_comp)
        
        # Расстояние (нормализованное)
        max_distance = 0
        for i in matrix.values():
            for j in i.values():
                dist = self.time_to_minutes(j) if isinstance(j, str) else j
                max_distance = max(max_distance, dist)
        
        normalized_distance = travel_time / max_distance if max_distance > 0 else 0
        features.append(normalized_distance)
        
        # Время суток
        time_of_day = current_time % (24*60) / (24*60)
        features.append(time_of_day)
        
        # Важность точки
        importance = 1.5 if candidate_point.get('priority') == 'VIP' else 1.0
        features.append(importance)
        
        return np.array(features).reshape(1, -1)
    
    def calculate_window_compatibility(self, point, current_time):
        """Рассчитывает совместимость с временными окнами"""
        if 'time_windows' not in point:
            return 1.0
        
        best_compatibility = 0
        for window in point['time_windows']:
            window_start = self.time_to_minutes(window['start'])
            window_end = self.time_to_minutes(window['end'])
            
            if current_time <= window_end:
                if current_time >= window_start:
                    best_compatibility = max(best_compatibility, 1.0)
                else:
                    wait_time = window_start - current_time
                    if wait_time <= 60:
                        best_compatibility = max(best_compatibility, 0.7)
                    else:
                        best_compatibility = max(best_compatibility, 0.3)
        
        return best_compatibility
    
    def solve_single_case(self, matrix, points_features):
        """Решает одну задачу VRP с использованием обученной модели"""
        if not self.is_loaded:
            print("⚠️  Модель не загружена, используется эвристический метод")
            return self.fallback_solution(points_features)
        
        # Создаем словарь точек
        points_dict = {point['id']: point for point in points_features}
        
        # Начинаем с точки 1
        start_point_id = 1
        route = [start_point_id]
        current_point_id = start_point_id
        visited = {start_point_id}
        current_time = self.time_to_minutes("09:00:00")
        
        # Посещаем все точки
        while len(visited) < len(points_features):
            best_next_id = None
            best_score = -float('inf')
            
            for point in points_features:
                if point['id'] in visited:
                    continue
                
                # Получаем фичи и оценку от ML модели
                current_point = points_dict[current_point_id]
                features = self.extract_features(current_point, point, matrix, current_time)
                
                try:
                    # Масштабируем фичи и получаем оценку от модели
                    features_normalized = self.scaler.transform(features)
                    ml_score = self.model.predict(features_normalized)[0]
                    
                    # Комбинируем с эвристиками
                    travel_time = matrix.get(str(current_point_id), {}).get(str(point['id']), 0)
                    if isinstance(travel_time, str):
                        travel_time = self.time_to_minutes(travel_time)
                    
                    priority_bonus = 0.2 if point.get('priority') == 'VIP' else 0
                    time_score = 1 / (travel_time + 1) * 0.3
                    
                    combined_score = ml_score * 0.5 + time_score + priority_bonus
                    
                    if combined_score > best_score:
                        best_score = combined_score
                        best_next_id = point['id']
                        
                except Exception as e:
                    # В случае ошибки используем эвристику
                    travel_time = matrix.get(str(current_point_id), {}).get(str(point['id']), 0)
                    if isinstance(travel_time, str):
                        travel_time = self.time_to_minutes(travel_time)
                    
                    priority_bonus = 100 if point.get('priority') == 'VIP' else 0
                    time_score = 1 / (travel_time + 1) * 50
                    combined_score = priority_bonus + time_score
                    
                    if combined_score > best_score:
                        best_score = combined_score
                        best_next_id = point['id']
            
            if best_next_id:
                route.append(best_next_id)
                visited.add(best_next_id)
                
                # Обновляем время
                travel_time = matrix.get(str(current_point_id), {}).get(str(best_next_id), 0)
                if isinstance(travel_time, str):
                    travel_time = self.time_to_minutes(travel_time)
                current_time += travel_time + self.service_time
                current_point_id = best_next_id
            else:
                break
        
        return route
    
    def fallback_solution(self, points_features):
        """Простое решение по умолчанию"""
        point_ids = [p['id'] for p in points_features]
        
        if 1 in point_ids:
            vip_points = [p['id'] for p in points_features if p.get('priority') == 'VIP' and p['id'] != 1]
            standard_points = [p['id'] for p in points_features if p.get('priority') != 'VIP' and p['id'] != 1]
            route = [1] + vip_points + standard_points
        else:
            route = point_ids
        
        return route
    
    def fetch_input_data(self, input_url: str, timeout: int = 30) -> Optional[List[Dict]]:
        """
        Получает входные данные с REST API
        """
        try:
            print(f"🌐 Загрузка данных с {input_url}...")
            response = requests.get(input_url, timeout=timeout)
            response.raise_for_status()
            
            input_data = response.json()
            print("✅ Данные успешно загружены")
            
            # Всегда обрабатываем как список случаев
            if not isinstance(input_data, list):
                input_data = [input_data]
            
            print(f"📊 Найдено случаев: {len(input_data)}")
            return input_data
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка загрузки данных: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"❌ Ошибка парсинга JSON: {e}")
            return None
    
    def send_output_data(self, output_url: str, results: List, timeout: int = 30) -> bool:
        """
        Отправляет результаты на REST API
        """
        try:
            print(f"🌐 Отправка результатов на {output_url}...")
            
            # Подготавливаем данные для отправки
            payload = {
                "routes": results,
                "timestamp": np.datetime64('now').astype(str),
                "status": "success"
            }
            
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'VRPSolver/1.0'
            }
            
            response = requests.post(
                output_url, 
                json=payload, 
                headers=headers, 
                timeout=timeout
            )
            response.raise_for_status()
            
            print("✅ Результаты успешно отправлены")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Ошибка отправки результатов: {e}")
            return False
    
    def process_from_api(self, input_url: str, output_url: str) -> Optional[List]:
        """
        Обрабатывает данные из REST API и отправляет результаты обратно
        """
        # Получаем данные
        input_data = self.fetch_input_data(input_url)
        if input_data is None:
            return None
        
        # Обрабатываем каждый случай
        results = []
        for i, case in enumerate(input_data):
            print(f"🔹 Обработка случая {i+1}/{len(input_data)}...")
            
            matrix = case['matrix']
            points_features = case['points_features']
            
            route = self.solve_single_case(matrix, points_features)
            results.append(route)
            print(f"   Маршрут: {route}")
        
        # Отправляем результаты
        success = self.send_output_data(output_url, results)
        if success:
            return results
        else:
            return None

# Основная функция для использования
def solve_vrp_via_api(input_url: str, output_url: str, 
                     model_path: str = 'trained_vrp_model.pkl') -> Optional[List]:
    """
    Основная функция для решения VRP через REST API
    """
    solver = TrainedVRPSolver(model_path)
    results = solver.process_from_api(input_url, output_url)
    return results

# Запуск из командной строки
if __name__ == "__main__":
    import sys
    
    # Параметры по умолчанию
    default_input_url = "https://api.example.com/vrp/input"
    default_output_url = "https://api.example.com/vrp/output"
    default_model = "trained_vrp_model.pkl"
    
    if len(sys.argv) > 1:
        input_url = sys.argv[1]
    else:
        input_url = default_input_url
    
    if len(sys.argv) > 2:
        output_url = sys.argv[2]
    else:
        output_url = default_output_url
    
    if len(sys.argv) > 3:
        model_file = sys.argv[3]
    else:
        model_file = default_model
    
    print(f"🔗 Входной URL: {input_url}")
    print(f"🔗 Выходной URL: {output_url}")
    print(f"🤖 Модель: {model_file}")
    
    # Проверяем доступность модели
    if not Path(model_file).exists():
        print(f"❌ Файл модели {model_file} не найден")
        print("Использование: python vrp_solver.py [input_url] [output_url] [model.pkl]")
        sys.exit(1)
    
    # Запускаем решение
    results = solve_vrp_via_api(
        input_url=input_url,
        output_url=output_url,
        model_path=model_file
    )
    
    if results is not None:
        print(f"🎯 Финальные результаты: {results}")
    else:
        print("❌ Произошла ошибка при обработке")
        sys.exit(1)