package app.vx.dgtuhack2025.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "yandex.maps")
@Data
public class YandexMapsConfig {

    @Value("${yandex.maps.apikey}")
    private String apiKey;
    private String geocoderUrl = "https://geocode-maps.yandex.ru/1.x/";
}
