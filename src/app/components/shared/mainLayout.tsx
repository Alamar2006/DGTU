'use client'

import { YMaps, Map, Placemark  } from "@pbe/react-yandex-maps"
import { useClients } from "../../../../hooks/useClients"
import { Flex, Spin } from "antd"
import { useEffect } from "react"
import { useNotification } from "../../../../hooks/useNotification"

interface Props {
    classname?: string
}

export const MainLayout: React.FC<Props> = () => {
    const {coords, loading, error} = useClients()
    const { contextHolder, showError } = useNotification()

    useEffect(() => {
        if (error) {
            showError('Ошибка загрузки данных', error)
        }
    }, [error, showError])

    const placemarks = Object.entries(coords).map(([clientId, coord]) => ({
        id: clientId,
        coordinates: [parseFloat(coord.latitude), parseFloat(coord.longtude)],
        properties: {
            balloonContent: `Клиент #${clientId}`,
            hintContent: `Клиент #${clientId}`
        }

    }))

    if(loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Flex align="center" gap="middle">
                    <Spin size="large"/>
                </Flex>
            </div>
        )
    }
    
    return (
        <>
        
        {contextHolder}
        
        <YMaps 
            query={{
                apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "", 
                lang: "ru_RU",
                load: "package.full"
            }}
        >
            <div className="w-screen h-screen relative">
                <Map 
                    defaultState={{
                        center: [55.75, 37.57], 
                        zoom: 9
                    }} 
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                >
                    {
                        placemarks.map(placemark => (
                            <Placemark
                            key={placemark.id}
                            geometry={placemark.coordinates}
                            properties={placemark.properties}
                            options={{
                                preset: 'islands#blueCircleIcon', 
                            }}
                        />
                        ))
                    }
                </Map>
                
                
            </div>
        </YMaps>
        
        </>
    )
}