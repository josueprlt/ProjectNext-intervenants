import Link from 'next/link';
import Image from "next/image";
import NavLinks from "./nav-links";
import { SignOutIcon } from "@/app/ui/icons";
import { signOut } from 'next-auth';

export default function SideNav() {

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-red p-4 md:h-40"
                href="/"
            >
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:px-8 md:flex md:items-center">
                    <Image
                        src="/universiteLimoges.png"
                        width={700}
                        height={760}
                        className="hidden md:block"
                        alt="Screenshots of the dashboard project showing desktop version"
                    />
                </div>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-redLight hover:text-redHover md:flex-none md:justify-start md:p-2 md:px-3">
                        <SignOutIcon className="w-6" />
                        <div className="hidden md:block">Se Déconnecter</div>
                    </button>
                </form>
            </div>
        </div>
    );
}