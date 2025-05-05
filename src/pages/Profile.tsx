import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { format, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Camera, Download, Upload, Send, Calendar, Bell, FileText, BarChart, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import type { Profile, UserStats, PersonalRecord, WorkoutLog } from '../types';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [stats, setStats] = React.useState<UserStats[]>([]);
  const [records, setRecords] = React.useState<PersonalRecord[]>([]);
  const [logs, setLogs] = React.useState<WorkoutLog[]>([]);
  const [note, setNote] = React.useState('');
  const [notifications, setNotifications] = React.useState<{ day: string; time: string; enabled: boolean }[]>([]);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: '',
    birth_date: '',
    gender: '',
    height: '',
    weight: ''
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        birth_date: format(new Date(profileData.birth_date), 'yyyy-MM-dd'),
        gender: profileData.gender,
        height: getCurrentHeight()?.toString() || '',
        weight: getCurrentWeight()?.toString() || ''
      });
    }

    // Load stats
    const { data: statsData } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (statsData) setStats(statsData);

    // Load records
    const { data: recordsData } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (recordsData) setRecords(recordsData);

    // Load workout logs
    const { data: logsData } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('workout_date', { ascending: false });

    if (logsData) setLogs(logsData);

    // Load notifications
    const { data: notificationsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id);

    if (notificationsData) {
      setNotifications(notificationsData.map(n => ({
        day: n.day_of_week,
        time: n.time,
        enabled: n.enabled
      })));
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      await loadUserData();
      toast.success('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar foto de perfil');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profile
      await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          birth_date: editForm.birth_date,
          gender: editForm.gender
        })
        .eq('id', user.id);

      // Add new stats if weight or height changed
      if (editForm.weight || editForm.height) {
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            weight: Number(editForm.weight),
            height: Number(editForm.height)
          });
      }

      await loadUserData();
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!note.trim()) {
      toast.error('Por favor, escreva uma anotação');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('workout_notes')
        .insert({
          user_id: user.id,
          content: note.trim()
        });

      if (error) throw error;

      setNote('');
      await loadUserData();
      toast.success('Anotação salva com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar anotação');
    }
  };

  const handleClearProgress = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todo o seu progresso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await Promise.all([
        supabase.from('user_stats').delete().eq('user_id', user.id),
        supabase.from('personal_records').delete().eq('user_id', user.id),
        supabase.from('workout_logs').delete().eq('user_id', user.id)
      ]);

      await loadUserData();
      toast.success('Progresso limpo com sucesso!');
    } catch (error) {
      toast.error('Erro ao limpar progresso');
    }
  };

  const handleExportData = () => {
    try {
      // Prepare profile data
      const profileData = profile ? [{
        ...profile,
        birth_date: format(new Date(profile.birth_date), 'yyyy-MM-dd'),
        created_at: format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm:ss'),
        updated_at: format(new Date(profile.updated_at), 'yyyy-MM-dd HH:mm:ss')
      }] : [];

      // Prepare stats data
      const statsData = stats.map(stat => ({
        ...stat,
        date: format(new Date(stat.date), 'yyyy-MM-dd'),
        created_at: format(new Date(stat.created_at), 'yyyy-MM-dd HH:mm:ss')
      }));

      // Prepare records data
      const recordsData = records.map(record => ({
        ...record,
        date: format(new Date(record.date), 'yyyy-MM-dd'),
        created_at: format(new Date(record.created_at), 'yyyy-MM-dd HH:mm:ss')
      }));

      // Prepare logs data
      const logsData = logs.map(log => ({
        ...log,
        workout_date: format(new Date(log.workout_date), 'yyyy-MM-dd'),
        created_at: format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        completed_exercises: JSON.stringify(log.completed_exercises)
      }));

      // Create CSV files for each data type
      const files = {
        'profile.csv': Papa.unparse(profileData),
        'stats.csv': Papa.unparse(statsData),
        'records.csv': Papa.unparse(recordsData),
        'workout_logs.csv': Papa.unparse(logsData)
      };

      // Save each file
      Object.entries(files).forEach(([filename, content]) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, filename);
      });

      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Implementation for data import will go here
      toast.info('Importação de dados em desenvolvimento');
    } catch (error) {
      toast.error('Erro ao importar dados');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  const calculateBMI = () => {
    if (!stats.length || !getCurrentHeight()) return 'Não calculado';
    const latestStats = stats[stats.length - 1];
    const heightInMeters = latestStats.height / 100;
    const bmi = latestStats.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getAge = () => {
    if (!profile?.birth_date) return null;
    return differenceInYears(new Date(), new Date(profile.birth_date));
  };

  const getWorkoutDays = () => {
    if (!logs.length) return 0;
    const uniqueDays = new Set(logs.map(log => log.workout_date));
    return uniqueDays.size;
  };

  const getCurrentWeight = () => {
    if (!stats.length) return null;
    return stats[stats.length - 1].weight;
  };

  const getCurrentHeight = () => {
    if (!stats.length) return null;
    return stats[stats.length - 1].height;
  };

  const weightData = {
    labels: stats.map(s => format(new Date(s.date), 'dd/MM/yyyy')),
    datasets: [
      {
        label: 'Peso (kg)',
        data: stats.map(s => s.weight),
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 mb-16 space-y-8">
      <h1 className="text-2xl font-bold">Perfil</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={profile?.avatar_url || 'https://via.placeholder.com/100'}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{profile?.name}</h2>
          <div className="w-full max-w-[200px]">
            <p className="text-center text-gray-600 mb-1">Nível {profile?.level}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(profile?.xp || 0) % 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{getCurrentWeight() || '-'}</p>
            <p className="text-sm text-gray-600">Peso (kg)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{getWorkoutDays()}</p>
            <p className="text-sm text-gray-600">Dias Treinados</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setIsPersonalInfoOpen(!isPersonalInfoOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <span className="text-lg font-semibold">Informações Pessoais</span>
          {isPersonalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {isPersonalInfoOpen && (
          <div className="px-6 pb-4">
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={editForm.birth_date}
                    onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: 75.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ex: 175"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">Editar Informações</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Idade</span>
                  <span className="font-medium">{getAge()} anos</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Peso Atual</span>
                  <span className="font-medium">{getCurrentWeight()} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Altura</span>
                  <span className="font-medium">{getCurrentHeight()} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">IMC</span>
                  <span className="font-medium">{calculateBMI()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Gênero</span>
                  <span className="font-medium">{profile?.gender}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart size={20} />
            Progresso
          </h3>
          <button
            onClick={handleClearProgress}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <Trash2 size={16} />
            Limpar
          </button>
        </div>
        
        {stats.length > 0 ? (
          <div className="h-64">
            <Line data={weightData} options={{ maintainAspectRatio: false }} />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum registro de peso encontrado
          </p>
        )}

        {records.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Recordes Pessoais (1RM)</h4>
            <div className="space-y-2">
              {records.map(record => (
                <div key={record.id} className="flex justify-between items-center">
                  <span>{record.exercise_name}</span>
                  <span className="font-medium">{record.weight}kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Workout History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Histórico de Treinos
        </h3>
        
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  {format(new Date(log.workout_date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <span className="text-sm text-gray-500">
                  {log.completed_exercises.length} exercícios
                </span>
              </div>
              {log.notes && (
                <p className="text-sm text-gray-600">{log.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notificações
        </h3>
        
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{notification.day}</p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notification.enabled}
                  onChange={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    
                    await supabase
                      .from('notifications')
                      .update({ enabled: !notification.enabled })
                      .eq('user_id', user.id)
                      .eq('day_of_week', notification.day);
                    
                    await loadUserData();
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} />
          Anotações
        </h3>
        
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Escreva suas anotações aqui..."
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Salvar Anotação
          </button>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <button
          onClick={handleExportData}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          <Download size={20} />
          Exportar Dados
        </button>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700"
        >
          <Upload size={20} />
          Importar Dados
        </button>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleImportData}
        />
        
        <button
          onClick={() => {
            window.location.href = `mailto:support@example.com?subject=Feedback do App`;
          }}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          <Send size={20} />
          Enviar Feedback
        </button>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
}