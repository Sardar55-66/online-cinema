'use client';

import Link from 'next/link';
import { useCinemas } from '@/app/lib/api';
import { CenteredMuiLoader } from '@/components/MuiLoader';
import { Button } from '@mui/material';

export default function CinemasPage() {
  const { data: cinemas, isLoading, isError } = useCinemas();

  if (isLoading) return <CenteredMuiLoader text="Загрузка кинотеатров..." />;
  if (isError || !cinemas)
    return <div className="text-gray-400 text-center mt-10">Ошибка загрузки кинотеатров</div>;

  return (
    <div className="p-6 overflow-y-auto h-[100vh] scrollbar-hide">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-gray-900 rounded-lg overflow-y-auto h-[100vh] scrollbar-hide">
          <table className="w-full mt-[25px]">
            <thead className='mb-[15px]'>
              <tr className="border-b border-white mb-[15px]">
                <th className="p-4 text-left text-white font-semibold"><p className='mb-[15px]'>Кинотеатр</p></th>
                <th className="p-4 text-left text-white font-semibold"><p className='mb-[15px]'>Адрес</p></th>
              </tr>
            </thead>
            <tbody>
              {cinemas.map((cinema) => (
                <tr key={cinema.id} className="last:border-b-0 ">
                  <td className="p-4 text-white">
                    <p className='my-[20px]'>{cinema.name}</p>
                  </td>
                  <td className="p-4 text-white">—</td>
                  <td>
                    <Link href={`/cinemas/${cinema.id}`}>
                      <Button
                        variant="outlined"
                        className="text-[12px] rounded-lg px-4 py-2"
                      >
                        Посмотреть сеансы
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
