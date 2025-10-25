'use client'
import { Drawer, Modal, Input, TimePicker, Select, Form, message, Button, notification } from "antd";
import React, { useState } from "react"
import { useClickAway } from "react-use"
import { useClient } from "../../../../hooks/useClient";
import { ClientFormData } from "../../../../api/client";
import { ClientsList } from "./items";
import { RedoDot, Waypoints } from "lucide-react";
import {DrawButton} from './drawButton'

const { Option } = Select;

interface Props {
    className?: string
    isOpen: boolean
    setIsOpen: () => void
}

export const SideBar: React.FC<Props> = ({
    isOpen,
    setIsOpen,
    className
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const ref = React.useRef(null);

    const { saving, createClient } = useClient()

    useClickAway(ref, () => {
        setIsOpen()
    })

    const handleCreateItem = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            const formData: ClientFormData = {
                address: values.address,
                dayStart: values.dayStart?.format('HH:mm'), 
                dayEnd: values.dayEnd?.format('HH:mm'),
                lunchStart: values.lunchStart?.format('HH:mm'),
                lunchEnd: values.lunchEnd?.format('HH:mm'),
                priority: values.priority,
            };
            
    
            const createdClient = await createClient(formData); 
            message.success('Запрос отправился успешно!');

            setIsModalOpen(false);
            form.resetFields();
            
            
        } catch (error) {
            if (error instanceof Error && error.message !== 'Validate Failed') {
                console.error('Error creating client:', error);
                message.error('Ошибка при создании клиента');
            }
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };


    return (
        <>
            <Drawer
    ref={ref}
    title={
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">≡</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">Навигация</span>
        </div>
    }
    placement="left"
    open={isOpen}
    onClose={setIsOpen}
    width={340}
    style={{ 
        top: '60px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}
    
>
    {/* Drag & Drop зона */}
    <div className="mb-6 p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-pointer group">
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-linear-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white text-2xl">↑</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Перетащите файл сюда</p>
            <p className="text-xs text-gray-500 mt-1">или нажмите для выбора</p>
        </div>
    </div>

    <div className="flex flex-col gap-4">
        <Button 
            type="primary"
            size="large"
            className="h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl flex items-center justify-center gap-3"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <div className="w-6 h-6 bg-opacity-20 rounded flex items-center justify-center">
                <RedoDot size={16} />
            </div>
            Загрузить файл
        </Button>
        
        <Button 
            onClick={handleCreateItem}
            type="primary"
            size="large"
            className="h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
        >
            <div className="w-6 h-6 bg-opacity-20 rounded flex items-center justify-center">
            <Waypoints size={16} />
            </div>
            Создать путь
        </Button>


        <DrawButton/>


    </div>
    
    <div className="mt-8 pt-6 border-t border-gray-200">
        <ClientsList />
    </div>
</Drawer>

            <Modal
                title="Создать новый пункт"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Создать"
                cancelText="Отмена"
                confirmLoading={saving} 
                okButtonProps={{ disabled: saving }}
                zIndex={1001}
            >
                
                <Form
                    form={form}
                    layout="vertical"
                    name="createItemForm"
                >
                    <Form.Item
                        label="Адрес объекта"
                        name="address"
                        rules={[{ required: true, message: 'Пожалуйста, введите адрес объекта' }]}
                    >
                        <Input placeholder="Введите адрес объекта" />
                    </Form.Item>

                    <Form.Item
                        label="Начало рабочего дня"
                        name="dayStart"
                        rules={[{ required: true, message: 'Пожалуйста, выберите время начала работы' }]}
                    >
                        <TimePicker  placeholder="Выберите время" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Окончание рабочего дня"
                        name="dayEnd"
                        rules={[{ required: true, message: 'Пожалуйста, выберите время окончания работы' }]}
                    >
                        <TimePicker  placeholder="Выберите время" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Начало обеда"
                        name="lunchStart"
                        rules={[{ required: true, message: 'Пожалуйста, выберите время начала обеда' }]}
                    >
                        <TimePicker  placeholder="Выберите время" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Окончание обеда"
                        name="lunchEnd"
                        rules={[{ required: true, message: 'Пожалуйста, выберите время окончания обеда' }]}
                    >
                        <TimePicker  placeholder="Выберите время" format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Уровень клиента"
                        name="priority"
                        rules={[{ required: true, message: 'Пожалуйста, выберите уровень клиента' }]}
                    >
                        <Select placeholder="Выберите уровень клиента">
                            <Option value="vip">VIP</Option>
                            <Option value="standard">Стандарт</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            
        </>
    )
}