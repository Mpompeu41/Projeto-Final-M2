require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());

let message = "";

const Kimono = require("./models/kimono");

app.get("/", async (req, res) => {
  
  const kimono = await Kimono.findAll(); 
  
  res.render("index", {
    kimono, message
  });
});

app.get("/detalhes/:id", async (req, res) => { 
  const kimonos = await Kimono.findByPk(req.params.id); 

  res.render("detalhes", {
    kimonos,
  });
});

app.get("/cadastro", (req, res) => {
  res.render("cadastro", {message});
});

app.post("/cadastro", async (req, res) => {

  const { nome, tamanho, cor, preco, imagem } = req.body;

  if (!nome) {
    res.render("cadastro", {
      message: "Nome é obrigatório",
    });
  }

  else if (!tamanho) {
    res.render("cadastro", {
      message: "tamanho é obrigatório",
    });
  }
  else if (!preco) {
    res.render("cadastro", {
      message: "preço é obrigatório",
    });
  }
  else if (!imagem) {
    res.render("cadastro", {
      message: "Imagem é obrigatório",
    });
  }

  else {
    try {
      const kimono = await Kimono.create({
        nome,
        tamanho,
        cor,
        preco,
        imagem
      });

      res.redirect("/");
    } catch (err) {
      console.log(err);

      res.render("cadastro", {
        message: "Ocorreu um erro ao cadastrar do kimono!",
      });
    }
  }
});


app.get("/editar/:id", async (req, res) => {
  const kimono = await Kimono.findByPk(req.params.id);

  if (!kimono) {
    res.render("editar", {
      kimono,
      message: "kimono não encontrado!",
    });
  }

  res.render("editar", {
    kimono, message
  });
});


app.post("/editar/:id", async (req, res) => {
  const kimono = await Kimono.findByPk(req.params.id);

  const { nome, tamanho, cor, preco, imagem } = req.body;

  kimono.nome = nome;
  kimono.tamanho = tamanho;
  kimono.cor = cor;
  kimono.preco = preco;
  kimono.imagem = imagem;

  const kimonoEditado = await kimono.save();

  res.render("editar", {
    kimono: kimonoEditado,
    message: "kimono editado com sucesso!",
  });
});


app.get("/deletar/:id", async (req, res) => {
  const kimono = await Kimono.findByPk(req.params.id);

  if (!kimono) {
    res.render("deletar", {
      kimono,
      message: "kimono não encontrado!",
    });
  }

  res.render("deletar", {
    kimono, message
  });
});


app.post("/deletar/:id", async (req, res) => {
  const kimono = await Kimono.findByPk(req.params.id);

  if (!kimono) {
    res.render("deletar", {
      mensagem: "kimono não encontrado!",
    });
  }

  await kimono.destroy();

  res.redirect("/");
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`))







