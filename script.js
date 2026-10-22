/* =========================================================
   A.F.R — Logika Pemesanan Tiket
   ========================================================= */

/* ---------- Helper ---------- */
const $ = (id) => document.getElementById(id);
const rupiah = (angka) => 'Rp ' + angka.toLocaleString('id-ID');

/* ---------- Konfigurasi & State ---------- */
const KURSI_TERISI = [1, 4, 6, 9, 10, 14, 17, 20, 23];
const MAKS_KURSI = 4;
const BARIS = 6;
const KOLOM = ['A', 'B', '', 'C', 'D']; // '' = lorong
let kursiDipilih = [];

/* ---------- Tanggal default (3 hari dari sekarang) ---------- */
const tanggalDefault = new Date();
tanggalDefault.setDate(tanggalDefault.getDate() + 3);
$('tg').value = tanggalDefault.toISOString().slice(0, 10);

/* ---------- Denah kursi ---------- */
function buatDenahKursi() {
  const wadah = $('seats');

  for (let baris = 1; baris <= BARIS; baris++) {
    KOLOM.forEach((kolom, i) => {
      // Lorong di tengah
      if (!kolom) {
        wadah.appendChild(document.createElement('span'));
        return;
      }

      const nomor = (baris - 1) * 4 + (i > 2 ? i - 1 : i) + 1;
      const label = baris + kolom;
      const terisi = KURSI_TERISI.includes(nomor);

      const tombol = document.createElement('button');
      tombol.className = 's' + (terisi ? ' x' : '');
      tombol.textContent = label;

      if (!terisi) {
        tombol.onclick = () => pilihKursi(label, tombol);
      }
      wadah.appendChild(tombol);
    });
  }
}

function pilihKursi(label, tombol) {
  const posisi = kursiDipilih.indexOf(label);

  if (posisi > -1) {
    kursiDipilih.splice(posisi, 1); // batalkan pilihan
  } else if (kursiDipilih.length < MAKS_KURSI) {
    kursiDipilih.push(label); // tambah pilihan
  }

  tombol.classList.toggle('on', kursiDipilih.includes(label));
  perbaruiRingkasan();
}

/* ---------- Ringkasan harga ---------- */
function perbaruiRingkasan() {
  const harga = Number($('rt').value);
  $('cnt').textContent = kursiDipilih.length + ' kursi';
  $('tot').textContent = rupiah(kursiDipilih.length * harga);
}

/* ---------- Barcode ---------- */
function buatBarcode(kode) {
  let x = 0;
  let batang = '';

  for (const karakter of kode) {
    const nilai = karakter.charCodeAt(0);

    for (let bit = 0; bit < 4; bit++) {
      const lebar = ((nilai >> bit) & 1) + 1.5;
      batang += `<rect x="${x}" y="0" width="${lebar}" height="46" fill="#0d0b09"/>`;
      x += lebar + 2.5;
    }
    x += 2;
  }
  return { batang, lebarTotal: x };
}

/* ---------- Proses pemesanan ---------- */
function pesanTiket() {
  const nama = $('nm').value.trim();
  const rute = $('rt');

  if (!kursiDipilih.length) return alert('Pilih minimal 1 kursi.');
  if (!nama) return alert('Isi nama penumpang.');

  const kode = 'AFR' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const total = kursiDipilih.length * Number(rute.value);
  const namaRute = rute.options[rute.selectedIndex].text;

  $('td').innerHTML = `
    <b>${kode}</b><br>
    ${nama} · ${namaRute}<br>
    ${$('tg').value} · Kursi ${kursiDipilih.join(', ')}<br>
    Total ${rupiah(total)} via ${$('pay').value}`;

  const { batang, lebarTotal } = buatBarcode(kode);
  $('bc').setAttribute('viewBox', `0 0 ${lebarTotal} 46`);
  $('bc').innerHTML = batang;

  const tiket = $('tk');
  tiket.style.display = 'block';
  tiket.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- Inisialisasi ---------- */
buatDenahKursi();
$('rt').onchange = perbaruiRingkasan;
$('go').onclick = pesanTiket;
