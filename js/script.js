const rakBuku = [];
const STORAGE_KEY = "BUKU-APPS";
const generateId = () => {
  return +new Date();
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
  saveData();
};
const saveData = () => {
  const parsed = JSON.stringify(rakBuku);
  localStorage.setItem(STORAGE_KEY, parsed);
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    tambahBuku();
  });
});
