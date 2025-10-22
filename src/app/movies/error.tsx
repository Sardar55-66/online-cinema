'use client';

export default function MovieError() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-2">Ошибка загрузки</h2>
        <p className="text-gray-400">Не удалось загрузить информацию о фильмах</p>
      </div>
    </div>
  );
}
