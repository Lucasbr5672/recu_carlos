import { v4 as uuidv4 } from "uuid";
import { createServer } from "node:http";
import fs from 'node:fs';

const PORT = 3333 || 8080;

const  lerDadosMotorista = (callback) => {
  fs.readFile("bustrack.json", "utf-8", (err, data) => {
      if(err){
          callback(err)
      }
      try {
          const motoristas = JSON.parse(data)
          callback(null, motoristas)
      } catch (error) {
          callback(error)
      }
  })
}

const server = createServer((request, response) => {

    const {method, url} = request

    if(method === 'GET' && url === '/name'){
      lerDadosMotorista((err, motoristas) => {
        if(err) {
            response.writeHead(500, {'Content-Type':'application/json'})
            response.end(JSON.stringify({message : 'Erro interno do servidor'}))
            return
        }
        const motoristaName = motoristas.map((motorista) => motorista.name).filter((motorista) => motorista != null)
        if(motoristaName.length == 0){
            response.writeHead(404, {'Content-Type':'application/json'})
            response.end(JSON.stringify({message: 'Motorista não encontrado'}))
            return
        }
        response.writeHead(200, {'Content-Type':'application/json'})
        response.end(JSON.stringify(motoristaName))
    })
    }else if(method === 'POST' && url.startsWith('/motorista')){
      let body = ''

      request.on('data', (chunck) => {
          body += chunck
      })

      request.on('end', () => {
          const novoMotorista = JSON.parse(body)
          lerDadosMotorista((err, motoristas) => {
              if(err) {
                  response.writeHead(500, {'Content-Type':'application/json'})
                  response.end(JSON.stringify({message : 'Erro interno do servidor'}))
                  return
              }
              novoMotorista.id_motorista = uuidv4()
              motoristas.push(novoMotorista)
              fs.writeFile("bustrack.json", JSON.stringify(motoristas, null, 2), (err) => {
                  if(err) {
                      response.writeHead(500, {'Content-Type':'application/json'})
                      response.end(JSON.stringify({message : 'Erro interno do servidor'}))
                      return
                  }
                  response.writeHead(201, {'Content-Type':'application/json'})
                  response.end(JSON.stringify({message : 'Motorista Cadastrado!'}))
              })
          })
      })
    }else if(method === 'POST' && url === '/onibus'){
      let body = ''

      request.on('data', (chunck) => {
          body += chunck
      })

      request.on('end', () => {
          const novoMotorista = JSON.parse(body)
          lerDadosMotorista((err, motoristas) => {
              if(err) {
                  response.writeHead(500, {'Content-Type':'application/json'})
                  response.end(JSON.stringify({message : 'Erro interno do servidor'}))
                  return
              }
              novoMotorista.id_motorista = uuidv4()
              motoristas.push(novoMotorista)
              fs.writeFile("bustrack.json", JSON.stringify(motoristas, null, 2), (err) => {
                  if(err) {
                      response.writeHead(500, {'Content-Type':'application/json'})
                      response.end(JSON.stringify({message : 'Erro interno do servidor'}))
                      return
                  }
                  response.writeHead(201, {'Content-Type':'application/json'})
                  response.end(JSON.stringify({message : 'Onibus Cadastrado!'}))
              })
          })
      })
    }else if(method === 'GET' && url.startsWith('/motorista/')){
      const id = url.split('/')[2]

      lerDadosMotorista((err, motoristas) => {
          if(err) {
              response.writeHead(500, {'Content-Type':'application/json'})
              response.end(JSON.stringify({message : 'Erro interno do servidor'}))
              return
          }

          const acharMotorista = motoristas.find((motorista) => motorista.id_motorista == id)
          if(!acharMotorista){
              response.writeHead(404, {'Content-Type':'application/json'})
              response.end(JSON.stringify({message : 'Motorista não encontrado'}))
              return
          }
          response.writeHead(201, {'Content-Type':'application/json'})
          response.end(JSON.stringify(acharMotorista))
      })
    }else if(method === 'GET' && url.startsWith('/onibus') ){
      const id = url.split('/')[2]

      lerDadosMotorista((err, motoristas) => {
          if(err) {
              response.writeHead(500, {'Content-Type':'application/json'})
              response.end(JSON.stringify({message : 'Erro interno do servidor'}))
              return
          }

          const acharMotorista = motoristas.find((motorista) => motorista.id_motorista == id)
          if(!acharMotorista){
              response.writeHead(404, {'Content-Type':'application/json'})
              response.end(JSON.stringify({message : 'Motorista não encontrado'}))
              return
          }
          response.writeHead(201, {'Content-Type':'application/json'})
          response.end(JSON.stringify(acharMotorista))
      })
    }else if(method === 'PUT' && url.startsWith('/motorista/') ){

    }else if(method === 'DELETE' && url.startsWith('/motorista/onibus/') ){
      const id = url.split('/')[2]

      lerDadosMotorista((err, motoristas) => {
          if(err) {
              response.writeHead(500, {'Content-Type':'application/json'})
              response.end(JSON.stringify({message : 'Erro interno do servidor'}))
              return
          }
          const motoristaName = motoristas.find((motorista) => motorista.id_motorista == id)
          console.log(motoristaName)
          return
      })
      response.writeHead(201, {'Content-Type':'application/json'})
      response.end(JSON.stringify({message : 'Motorista Deletado!'}))

    }else {
            response.writeHead(404, {'Content-Type':'application/json'})
            response.end(JSON.stringify({message : 'Rota não encontrada!'}))
            return
    }
})

server.listen(PORT, () => {
  console.log(`Servidor online in http://localhost/${PORT}`);
});
