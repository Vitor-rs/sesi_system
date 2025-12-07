export function Dashboard(): React.ReactElement {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Turmas Ativas</h3>
          <p className="text-3xl font-bold text-sesi-dark mt-2">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total de Alunos</h3>
          <p className="text-3xl font-bold text-sesi-blue mt-2">128</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Tarefas Pendentes</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">12</p>
        </div>
      </div>
    </div>
  )
}
