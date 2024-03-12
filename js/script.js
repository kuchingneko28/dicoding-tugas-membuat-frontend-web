const rakBuku = [];
const STORAGE_KEY = "BUKU-APPS";
const RENDER_EVENT = "render-buku";
const SAVED_EVENT = "simpan-buku";
const generateId = () => {
  return +new Date();
};
const checkStorage = () => {
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
  const objectBuku = generateObjectBuku(parseInt(generateID), judul, penulis, parseInt(tahun), false);

  rakBuku.push(objectBuku);
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanData();
};
const temukanBuku = (bukuId) => rakBuku.find((buku) => (buku.id === bukuId ? buku : null));
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
const buatButton = (innerText, classname, cb) => {
  const button = document.createElement("button");
  button.classList.add(classname);
  button.innerText = innerText;
  button.addEventListener("click", cb);

  return button;
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
    const tombolBelumSelesai = buatButton("Belum selesai dibaca", "button-belum-selesai", () => {
      undoBukuDariSelesai(objectBuku.id);
    });

    const tombolHapus = buatButton("Hapus buku", "button-hapus", () => {
      hapusBukuYangSelesai(objectBuku.id);
    });

    cardBuku.append(tombolBelumSelesai, tombolHapus);
  } else {
    const tombolCek = buatButton("Sudah selesai dibaca", "button-sudah-selesai", () => {
      tambahBukuSelesai(objectBuku.id);
    });
    const tombolHapus = buatButton("Hapus buku", "button-hapus", () => {
      hapusBukuYangSelesai(objectBuku.id);
    });
    cardBuku.append(tombolCek, tombolHapus);
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
  if (checkStorage()) {
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
  if (checkStorage()) {
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
