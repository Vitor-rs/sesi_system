import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Users, Plus, ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClassesStore } from '../../classes/stores/useClassesStore'
// Assume we have a student store or fetcher, for now we access basic stats
// import { useStudentsStore } from ...

export function Dashboard(): React.ReactElement {
  const { classes, fetchClasses } = useClassesStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  // Mock stats for now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalStudents = classes.reduce((acc, cls) => acc + ((cls as any).studentsCount || 0), 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Olá, Professor(a) 👋</h2>
          <p className="text-gray-500">Aqui está o resumo das suas turmas hoje.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/classes')} className="bg-sesi-blue hover:bg-blue-700">
            <BookOpen className="mr-2 h-4 w-4" />
            Minhas Turmas
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Turmas Ativas</p>
            <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-green-200 transition-colors">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Alunos</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalStudents > 0 ? totalStudents : '--'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-orange-200 transition-colors">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avaliações Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Recent Classes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">Suas Turmas</h3>
            <Link
              to="/classes"
              className="text-sm text-blue-600 hover:underline font-medium flex items-center"
            >
              Ver todas <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">Nenhuma turma encontrada.</p>
                <Button variant="outline" onClick={() => navigate('/classes')}>
                  Criar Primeira Turma
                </Button>
              </div>
            ) : (
              classes.slice(0, 4).map((cls) => (
                <Link
                  key={cls.id}
                  to={`/classes/${cls.id}`}
                  className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between h-28"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors text-lg truncate w-full">
                      {cls.name}
                    </h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      {cls.grade}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users size={14} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(cls as any).studentsCount || 0} alunos
                    </span>
                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              ))
            )}

            {classes.length > 0 && (
              <button
                onClick={() => navigate('/classes')}
                className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-gray-400 hover:text-blue-600 h-28"
              >
                <Plus size={24} className="mb-2" />
                <span className="font-medium text-sm">Nova Turma</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar: Quick Actions */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Acesso Rápido</h3>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 text-gray-700 hover:text-blue-700"
              onClick={() => navigate('/classes')}
            >
              <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <div>
                <div className="font-semibold">Gerenciar Turmas</div>
                <div className="text-xs text-gray-500 font-normal">Acessar diários e alunos</div>
              </div>
            </Button>
            <div className="h-px bg-gray-100 mx-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-green-50 text-gray-700 hover:text-green-700"
              onClick={() => navigate('/students')}
            >
              <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-500" />
              <div>
                <div className="font-semibold">Biblioteca de Alunos</div>
                <div className="text-xs text-gray-500 font-normal">
                  Todos os estudantes cadastrados
                </div>
              </div>
            </Button>
          </div>

          {/* Read Only Banner Mock */}
          <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
            <h4 className="font-bold text-purple-800 text-sm mb-1">Dica do Sistema</h4>
            <p className="text-xs text-purple-600 leading-relaxed">
              Para importar dados de outro professor (ex: Prof. Júlio), vá em{' '}
              <span className="font-bold">Configurações &gt; Dados</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
