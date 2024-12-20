export default function SkeletonModification() {

    return (
        <section className='h-screen flex flex-col justify-center' >
            <div>
                <div
                    className="max-w-xl p-6 m-auto bg-white rounded-lg bg-slate-100 text-slate-100 space-y-6 relative animate-pulse"
                >
                    <div className="w-8 h-8">
                         <div className='absolute bg-slate-200 right-5 top-5 w-8 h-8 overflow-hidden rounded-md'></div>
                     </div>
                    <h2 className='text-center mb-5 text-2xl bg-slate-200 text-slate-200 font-bold overflow-hidden rounded-md'>Modifier un intervenant</h2>
                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold bg-slate-200 text-slate-200 overflow-hidden rounded-lg">Prénom</p>
                        <div className="p-2 bg-slate-200 text-slate-200 rounded-md h-10"></div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold bg-slate-200 text-slate-200 overflow-hidden rounded-md">Nom</p>
                        <div className="p-2 bg-slate-200 text-slate-200 rounded-md h-10"></div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold bg-slate-200 text-slate-200 overflow-hidden rounded-md">Email</p>
                        <div className="p-2 rounded-md bg-slate-200 text-slate-200 h-10"></div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold bg-slate-200 text-slate-200 overflow-hidden rounded-md">Date de fin de validité</p>
                        <div className="p-2 rounded-md bg-slate-200 text-slate-200 h-10"></div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <p className="font-semibold bg-slate-200 text-slate-200 overflow-hidden rounded-md">Disponible</p>
                        <div className="p-2 rounded-md bg-slate-200 text-slate-200 h-10"></div>
                    </div>

                    <div className="w-full bg-slate-200 text-slate-200 py-2 rounded-md">
                        Modifier
                    </div>
                </div>
            </div>
        </section>
    );
}