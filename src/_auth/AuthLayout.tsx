import { Outlet } from "react-router-dom";
//72
export default function AuthLayout() {
    return (
        <section className="flex flex-1 justify-center items-center flex-col py-16">
            <Outlet />
        </section>
    )
}