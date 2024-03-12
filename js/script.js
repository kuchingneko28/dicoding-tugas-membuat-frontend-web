const rakBuku = [];
const STORAGE_KEY = "BUKU-APPS";
const RENDER_EVENT = "render-buku";
const SAVED_EVENT = "simpan-buku";
const generateId = () => {
  return +new Date();
};
const jikaStorageAda = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }

  return true;
};
const generateObjectBuku = (id, judul, penulis, tahun, isCompleted) => {
  return {
    id,
    judul,
    penulis,
    tahun,
    isCompleted,
  };
};
const tambahBuku = () => {
  const judul = document.getElementById("judul").value;
  const tahun = document.getElementById("tahun").value;
  const penulis = document.getElementById("penulis").value;
  const generateID = generateId();
  const objectBuku = generateObjectBuku(generateID, judul, tahun, penulis, false);

  rakBuku.push(objectBuku);
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
};
const temukanBuku = (bukuId) => {
  for (const buku of rakBuku) {
    if (buku.id == bukuId) {
      return buku;
    }
  }

  return null;
};
const undoBukuDariSelesai = (bukuId) => {
  const targetBuku = temukanBuku(bukuId);

  if (targetBuku == null) return;

  targetBuku.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
};
const tambahBukuSelesai = (bukuId) => {
  const targetBuku = temukanBuku(bukuId);
  if (targetBuku == null) return;

  targetBuku.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
};
const hapusBukuYangSelesai = (bukuId) => {
  const targetBuku = temukanIndexBuku(bukuId);

  if (targetBuku == -1) return;

  rakBuku.splice(targetBuku, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
};

const temukanIndexBuku = (bukuId) => {
  for (const index in rakBuku) {
    if (rakBuku[index].id === bukuId) {
      return index;
    }
  }
  return -1;
};
const buatBuku = (objectBuku) => {
  const judulBuku = document.createElement("h3");
  judulBuku.innerText = objectBuku.judul;

  const penulisBuku = document.createElement("p");
  penulisBuku.innerText = objectBuku.penulis;
  const tahunBuku = document.createElement("p");

  tahunBuku.innerText = objectBuku.tahun;

  const cardBuku = document.createElement("div");

  cardBuku.classList.add("buku");
  cardBuku.append(judulBuku, penulisBuku, tahunBuku);
  cardBuku.setAttribute("id", `todo-${objectBuku.id}`);
  if (objectBuku.isCompleted) {
    const tombolUndo = document.createElement("button");
    tombolUndo.classList.add("button-belum-selesai");
    tombolUndo.innerText = "Belum selesai dibaca";
    tombolUndo.addEventListener("click", () => {
      undoBukuDariSelesai(objectBuku.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("button-hapus");

    tombolHapus.innerText = "Hapus buku";
    tombolHapus.addEventListener("click", () => {
      hapusBukuYangSelesai(objectBuku.id);
    });
    cardBuku.append(tombolUndo, tombolHapus);
  } else {
    const tombolCek = document.createElement("button");

    tombolCek.classList.add("button-sudah-selesai");
    tombolCek.innerText = "Sudah selesai dibaca";
    tombolCek.addEventListener("click", () => {
      tambahBukuSelesai(objectBuku.id);
    });
    cardBuku.append(tombolCek);
  }
  return cardBuku;
};
const muatBukuDariStorage = () => {
  const dataDariLocalStorage = localStorage.getItem(STORAGE_KEY);
  let parseBuku = JSON.parse(dataDariLocalStorage);
  if (parseBuku !== null) {
    for (const buku of parseBuku) {
      rakBuku.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const simpanData = () => {
  if (jikaStorageAda()) {
    const parsed = JSON.stringify(rakBuku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};
document.addEventListener(RENDER_EVENT, () => {
  const bukuBelumSelesai = document.querySelector(".buku-belum-selesai");
  bukuBelumSelesai.innerText = "";
  const bukuSudahSelesai = document.querySelector(".buku-selsai");
  bukuSudahSelesai.innerText = "";

  for (const buku of rakBuku) {
    const elementBuku = buatBuku(buku);
    if (!buku.isCompleted) {
      bukuBelumSelesai.append(elementBuku);
    } else {
      bukuSudahSelesai.append(elementBuku);
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  if (jikaStorageAda()) {
    muatBukuDariStorage();
  }
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    tambahBuku();
  });
});
document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});
