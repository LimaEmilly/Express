import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
let users = [];
let veiculos = [
  {
    id: 1,
    modelo: "Civic",
    marca: "Honda",
    ano: 2014,
    cor: "Azul",
    preco: 40000,
  },
  {
    id: 2,
    modelo: "Corolla",
    marca: "Toyota",
    ano: 2015,
    cor: "Preto",
    preco: 45000,
  },
  {
    id: 3,
    modelo: "Golf",
    marca: "Volkswagen",
    ano: 2016,
    cor: "Branco",
    preco: 38000,
  },
];
app.post("/veiculos", (req, res) => {
  const { modelo, marca, ano, cor, preco } = req.body;
  const id = veiculos.length + 1;
  const veiculo = { id, modelo, marca, ano, cor, preco };
  veiculos.push(veiculo);
  res.status(201).json(veiculo);
});
app.get("/veiculos", (req, res) => {
  if (veiculos.length === 0) {
    response.status(404).send("Nenhum veículo encontrado");
  }
  const veiculosInfo = veiculos.map((veiculo) => {
    return {
      id: veiculo.id,
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      ano: veiculo.ano,
      cor: veiculo.cor,
      preco: veiculo.preco,
    };
  });
  res.json({ veiculos: veiculosInfo });
});
app.put("/veiculos/:id", (req, res) => {
  const { id } = req.params;
  const { cor, preco } = req.body;
  const veiculo = veiculos.find((veiculo) => veiculo.id === parseInt(id));
  if (!veiculo) {
    return res
      .status(404)
      .json({ message: "Veículo não encontrado. Volte para o menu inicial." });
  }
  veiculo.cor = cor;
  veiculo.preco = preco;
  res.json(veiculo);
});
app.delete("/veiculos/:id", (req, res) => {
  const { id } = req.params;
  const veiculoIndex = veiculos.findIndex(
    (veiculo) => veiculo.id === parseInt(id)
  );
  if (veiculoIndex === -1) {
    return res
      .status(404)
      .json({ message: "Veículo não encontrado. Volte para o menu inicial." });
  }
  veiculos.splice(veiculoIndex, 1);
  res.json({ message: "Veículo removido com sucesso." });
});
app.get("/veiculos/:marca", (req, res) => {
  const { marca } = req.params;
  const filtraVeiculos = veiculos.filter((veiculo) => veiculo.marca === marca);
  res.json(filtraVeiculos);
});
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: "Dados incompletos." });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(senha, saltRounds);
  const newUser = { nome, email, password: hashedPassword };
  users.push(newUser);
  res.json({ message: "Usuário criado com sucesso.", user: newUser });
});
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ error: "Insira um e-mail válido e uma senha válida." });
  }
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({
      error: "Email não encontrado no sistema, verifique ou crie uma conta.",
    });
  }
  const isMatch = bcrypt.compareSync(senha, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Senha incorreta." });
  }
  return res.status(200).json({
    message: `Seja bem vindo ${user.nome}! Pessoa usuária logada com sucesso!`,
    user,
  });
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});