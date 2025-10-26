'use client'
import { Drawer, Modal, Input, TimePicker, Select, Form, message, Button} from "antd";
import React, { useState } from "react"
import { useClickAway } from "react-use"
import { useClient } from "../../../../hooks/useClient";
import { ClientFormData } from "../../../../api/client";
import { ClientsList } from "./items";
import { RedoDot, Waypoints } from "lucide-react";
import {DrawButton} from './drawButton'
import { useTheme } from "next-themes";

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
    const { theme } = useTheme()

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
                    <span className="text-xl font-semibold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Навигация</span>
                </div>
                }
                placement="left"
                open={isOpen}
                onClose={setIsOpen}
                width={340}
                style={{ 
                    top: '60px',
                    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
                    background: theme === 'dark' ? '#0f172a' : '#f8fafc',
                }}
    
>
    {/* Drag & Drop зона */}
    <div className="mb-6 p-4 border-2 border-dashed border-emerald-300 dark:border-emerald-500 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all duration-300 cursor-pointer group">
        <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white text-2xl">↑</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-emerald-100">Перетащите файл сюда</p>
            <p className="text-xs text-gray-500 dark:text-emerald-200/70 mt-1">или нажмите для выбора</p>
        </div>
    </div>

    <div className="flex flex-col gap-4">
        <Button 
            type="primary"
            size="large"
            className="h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-violet-600 dark:to-indigo-600 dark:hover:from-violet-700 dark:hover:to-indigo-700"
        >
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                <RedoDot size={16} className="text-white"/>
            </div>
            <p className="text-white" >Загрузить файл</p>
        </Button>
        
        <Button 
            onClick={handleCreateItem}
            type="primary"
            size="large"
            className="h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 dark:from-rose-600 dark:to-orange-600 dark:hover:from-rose-700 dark:hover:to-orange-700"
        >
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                <Waypoints size={16} className="text-white"/>
            </div>
            <p className="text-white" >Создать путь</p>
        </Button>

        <DrawButton/>
    </div>
    
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
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
                        <TimePicker  placeholder="Выберите время" format="HH:mm" style={{ width: '100%'}} />
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