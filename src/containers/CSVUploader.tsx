import React, { useState } from 'react';
import Papa from 'papaparse';
import { VillagePopData } from '../types/structure';

const CSVUploader = () => {
  const [kelurahanData, setKelurahanData] = useState(
    null as Record<string, VillagePopData> | null
  );

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        delimiter: ',',
        newline: '\n',
        complete: (results) => {
          processData(results);
          // Pass kelurahanData to createMap or other functions as needed
        }
      });
    }
  };

  const processData = (results: any) => {
    const data = results.data.slice(1); // Remove the header
    const kelurahanData = {} as Record<string, VillagePopData>;

    data.forEach((row: any) => {
      const [
        tahun,
        nama_provinsi,
        nama_kabupaten,
        nama_kecamatan,
        nama_kelurahan,
        jenis_pekerjaan,
        jumlah
      ] = row as string[];

      if (!kelurahanData[nama_kelurahan]) {
        kelurahanData[nama_kelurahan] = {
          nama_kelurahan,
          nama_provinsi,
          nama_kabupaten,
          nama_kecamatan,
          occupations: {},
          total_population: -1,
          occupation_groups: {
            'Pekerjaan Lain': 0
          }
        };
      }

      kelurahanData[nama_kelurahan].occupations[jenis_pekerjaan] =
        parseInt(jumlah);

      kelurahanData[nama_kelurahan].total_population = Object.values(
        kelurahanData[nama_kelurahan].occupations
      ).reduce((a: number, b: number) => (a || 0) + (b || 0), 0);

      Object.keys(kelurahanData[nama_kelurahan].occupations).forEach(
        (occup) => {
          if (
            [
              'Mengurus Rumah Tangga',
              'Belum/Tidak Bekerja',
              'Pelajar/Mahasiswa'
            ].includes(occup)
          ) {
            kelurahanData[nama_kelurahan].occupation_groups[occup] =
              kelurahanData[nama_kelurahan].occupations[occup];
          } else {
            kelurahanData[nama_kelurahan].occupation_groups['Pekerjaan Lain'] +=
              kelurahanData[nama_kelurahan].occupations[occup];
          }
        }
      );
    });

    setKelurahanData(kelurahanData);
    console.log('parsed populasi kelurahanData', kelurahanData);
  };

  return (
    <div>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileUpload}
      />
      {/* Render the map component and pass the kelurahanData as a prop */}
    </div>
  );
};

export default CSVUploader;
