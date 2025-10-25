'use client'
import { useState } from "react";
import { Header } from "./components/shared";
import { MainLayout } from "./components/shared/mainLayout";
import { SideBar } from "./components/shared/sideBar";


export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }


  return (
    <>
      <Header isOpen={isSidebarOpen} setIsOpen={toggleSidebar}/>
      <SideBar 
        isOpen={isSidebarOpen}
        setIsOpen={toggleSidebar}
      />
      <MainLayout />
    </>
    
  )
}
