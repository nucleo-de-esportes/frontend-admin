import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

interface ContainerProps {
    showHeader?: boolean;
    showFooter?: boolean;
    children: ReactNode;
}

const MainContainer = ({ children, showHeader = true, showFooter = true }: ContainerProps) => {
    return (
        <div className="bg-[#E4E4E4] min-h-screen flex flex-col">
            {showHeader && <Header />}
            <main className="flex-grow bg-gray-100 flex">
                <div className="max-w-4xl mx-auto bg-white shadow-sm flex flex-grow items-center justify-center">
                    {children}
                </div>
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainContainer;