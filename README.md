Typer Problem   
    
Kita mencari developer yang mandiri, ketika ada masalah, aktif mencari solusi dengan sendirinya dan mudah mengerti instruksi tanpa terlalu banyak menanyakan untuk memahami instruksi.     
Berikut adalah aplikasi Javascript yang simple.    
Kami tidak akan menjelaskan bagaimana cara kerjanya atau library apa yang dipakai.   
    
Pertanyaan:   
1. Sebutkan library apa saja yang dipakai, website library itu dimana, dan dokumentasi library itu ada dimana.    
2. Aplikasi itu 'laggy'. Kenapa? Bagaimana cara membuat animasi lebih 'smooth'?    
3. Aplikasi itu tidak akan jalan di salah satu 3 browser populer (Chrome, Firefox, Internet Explorer)? Kenapa? Solusinya hanya menghapus satu character di code, character yang mana?    
4. Implementasikan tombol Start, Stop, Pause, dan Resume.   
5. Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.    
6. Implementasikan sistem score.   
7. Implementasikan hukuman berupa pengurangan nilai bila salah ketik.

Jawaban: 
1. Library yang dipakai:
   - jQuery: http://jquery.com - Documentation: https://api.jquery.com
   - jQuery UI: http://jqueryui.com - Documentation: https://api.jqueryui.com
   - Underscore.js, Website + Documentation: http://underscorejs.org
   - Backbone.js, Website + Documentation: http://backbonejs.org
   - Bootstrap, Website + Documentation: http://getbootstrap.com
2. Laggy karena interval animasinya terlalu lambat (100 miliseconds), jadi harus diturunkan. Ketika diubah menjadi 10 miliseconds, animasi menjadi smooth namun kata yang muncul terlalu cepat turun. Oleh karena itu di dalam fungsi move(), speed diperlambat dengan cara memperkecil skala-nya. 
3. Saya belum bisa memastikan, tapi sepertinya browser Internet Explorer mengenali error trailing comma. 
4. Implementasi tombol Start, Pause, Resume, dan Stop. 

|   State   |   Start   |   Pause   | Text Input |
|-----------|-----------|-----------|------------|
| Normal    | Normal    | Disabled  | Disabled   |
| Started   | Change to Stop | Enabled | Enabled |
| Paused    | Disabled  | Change to Resume | Disabled |
| Resumed   | Enabled   | Change to Pause  | Enabled |
| Stop      | Change to Start | Disabled | Disabled |
