
export default function SkeletonOverviews() {

    const duplicatedContent = Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="relative grid grid-cols-7 gap-4 text-sm text-slate-100 bg-slate-100 py-3 items-center group">
            <div className='ml-2 text-slate-200 bg-slate-200 rounded-lg'>Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg">Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg">Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg">Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg">Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg">Animate</div>
            <div className="text-slate-200 bg-slate-200 rounded-lg mr-2">Animate</div>
        </div>
    ))

    return (
        <main className="flex min-h-screen flex-col p-2 pr-4 animate-pulse">
            <h1 className="text-3xl font-bold my-8 text-slate-200 bg-slate-200 rounded-lg">Gestion des Intervenants</h1>
            <div className='flex items-center gap-2 text-slate-200 bg-slate-200 mr-auto mb-2 rounded-lg px-2 py-2'>
                Ajouter un intervenant
            </div>
            <div className="rounded-lg p-4 bg-slate-200">
                <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-600 pb-2">
                    <div className='ml-2 text-slate-100 bg-slate-100 rounded-lg'>Prénom</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg">Nom</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg">Email</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg">Clé</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg">Date de création</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg">Date de fin</div>
                    <div className="text-slate-100 bg-slate-100 rounded-lg mr-2">Disponibilité</div>
                </div>
                <div className="divide-y rounded-lg overflow-hidden">
                    {duplicatedContent}
                </div>
            </div>
            <div className='flex gap-2 rounded-md text-slate-200 bg-slate-200 mr-auto mt-2 p-3 text-sm font-medium'>
                Regénérer les clés
            </div>
        </main>
    )
}