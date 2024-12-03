export default function SkeletonModification() {

    return (
        <section className='h-screen flex flex-col justify-center' >
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleModification();
                    }}
                    className="max-w-xl p-6 m-auto bg-white rounded-lg shadow-md space-y-6 relative"
                >
                    <Link href="/dashboard" className='text-red hover:text-redHover'>
                        <CloseIcon className='absolute right-5 top-5 w-8 h-8' />
                    </Link>
                    <h2 className='text-center mb-5 text-2xl font-bold'>Modifier un intervenant</h2>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="firstname" className="font-semibold text-gray-700">Prénom</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="Insérez Prénom"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="name" className="font-semibold text-gray-700">Nom</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insérez Nom"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Insérez Email"
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="date" className="font-semibold text-gray-700">Date de fin de validité</label>
                        <input
                            type="date"
                            id="date"
                            value={enddate}
                            onChange={(e) => setEnddate(e.target.value)}
                            required
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="availability" className="font-semibold text-gray-700">Disponible</label>
                        <textarea
                            id="availability"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red text-white py-2 rounded-md hover:bg-redHover focus:outline-none focus:ring-2 focus:ring-red"
                    >
                        Modifier
                    </button>
                    {errorMessage && (
                        <div className='text-center'>
                            <span className="text-red font-semibold text-sm mt-2">{errorMessage}</span>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}