export function ProfileTab(): React.ReactElement {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-20 h-20 bg-sesi-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        VR
      </div>
      <h2 className="text-xl font-bold text-gray-900">Vitor R.</h2>
      <p className="text-gray-500">Professor Titular</p>
      <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-lg inline-block text-sm">
        Edição de perfil será implementada em breve.
      </div>
    </div>
  )
}
