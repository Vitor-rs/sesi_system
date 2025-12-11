import { useSettingsStore } from '../../../stores/useSettingsStore'
import { GraduationCap, BookOpen, Microscope, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProfileTab(): React.ReactElement {
  const { teacherProfile, setTeacherProfile } = useSettingsStore()

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-linear-to-br from-sesi-blue to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/10 mb-4 ring-4 ring-blue-50">
          VR
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Vitor R.</h2>
        <p className="text-gray-500 font-medium mb-6">Professor Titular</p>

        <div className="flex gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <span>ID: 8492-AC</span>
          <span>•</span>
          <span>SESI/SC</span>
        </div>
      </div>

      {/* Teaching Mode Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <GraduationCap className="size-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Modo de Ensino</h3>
            <p className="text-sm text-gray-500">
              Isso define como o sistema cria novas turmas e disciplinas para você.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setTeacherProfile('pedagogue')}
            className={cn(
              'relative flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-sesi-blue/50 hover:bg-blue-50/30',
              teacherProfile === 'pedagogue'
                ? 'border-sesi-blue bg-blue-50/50 ring-2 ring-sesi-blue/20 shadow-xs'
                : 'border-gray-100 bg-white shadow-xs'
            )}
          >
            {teacherProfile === 'pedagogue' && (
              <div className="absolute top-4 right-4 bg-sesi-blue text-white p-1 rounded-full shadow-sm">
                <Check className="size-4" />
              </div>
            )}
            <div
              className={cn(
                'p-3 rounded-lg mb-4',
                teacherProfile === 'pedagogue'
                  ? 'bg-blue-100 text-sesi-blue'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              <BookOpen className="size-6" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-2">Pedagogo (1º Fundamental)</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Ideal para professores polivalentes. Ao criar uma turma, o sistema sugere
              automaticamente o pacote de disciplinas padrão (Português, Matemática, Hist, Geo,
              Ciências).
            </p>
          </button>

          <button
            onClick={() => setTeacherProfile('specialist')}
            className={cn(
              'relative flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 text-left hover:border-sesi-blue/50 hover:bg-blue-50/30',
              teacherProfile === 'specialist'
                ? 'border-sesi-blue bg-blue-50/50 ring-2 ring-sesi-blue/20 shadow-xs'
                : 'border-gray-100 bg-white shadow-xs'
            )}
          >
            {teacherProfile === 'specialist' && (
              <div className="absolute top-4 right-4 bg-sesi-blue text-white p-1 rounded-full shadow-sm">
                <Check className="size-4" />
              </div>
            )}
            <div
              className={cn(
                'p-3 rounded-lg mb-4',
                teacherProfile === 'specialist'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-500'
              )}
            >
              <Microscope className="size-6" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-2">Professor Especialista</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Ideal para professores do 2º Fundamental. Ao criar uma turma, o foco é cadastrar
              apenas as disciplinas que você leciona naquela turma.
            </p>
          </button>
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="shrink-0 mt-0.5">
            <GraduationCap className="size-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Nota:</span> Esta configuração é apenas um
            facilitador (wizard). Você sempre poderá adicionar ou remover disciplinas manualmente de
            qualquer turma, independente do modo escolhido (ex: Um especialista que dá aula de
            Matemática e Física).
          </p>
        </div>
      </div>
    </div>
  )
}
