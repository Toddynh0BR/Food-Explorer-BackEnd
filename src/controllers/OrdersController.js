const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class OrdersController {
    async Create(request, response) {
      const user_id = request.user.id;

        const orderExists = await knex('orders')
                                 .where({ user_id })
                                 .whereNot({ status: "entregue"})
                                 .first();
    
        if (orderExists) {
          return response.json({ message: "Já existe um pedido em criação"})
        }
    
        await knex("orders").insert({
          user_id
        });
    
        return response.json({ message: "Pedido criado com sucesso" });
    };

    async Update(request, response) {
      const { orders_id, status } = request.body;
      console.log(orders_id, status)
      const order = await knex("orders")
                         .where({ id: orders_id })
                         .first();

      if (!order) {
          throw new AppError("Pedido não encontrado.");
      }

      await knex("orders")
           .where({ id: orders_id })
           .update({ status });

      return response.json({ message: "Status do pedido atualizado com sucesso." });
    };
    
    async Show(request, response) {
        const user_id = request.user.id;
    
            const orders = await knex("orders")
                .where({ user_id })
                .orderBy("created_at", "desc")
                .first();
    
            if (!orders) {
             throw new AppError("Pedido não encontrado.");
            }
    
            const order_items = await knex("order_item")
                .where({ orders_id: orders.id });
    
            if (order_items.length === 0) {

             return response.json()
            }
            
            const status = orders.status;
            const total = orders.total;
            const id = orders.id;
    
            return response.json({ order_items, total, status, id }); 
    };
    
    async Historic(request, response) {
        const user_id = request.user.id;

        const user = await knex("users")
                          .where({ id: user_id })
                          .first();

        const isadmin = user.isadmin

         if (isadmin) {  
            const orders = await knex("orders")
                                .whereNot({ status: "criando" })
                                .orderBy("created_at", "desc");
         
            if (orders.length === 0) {
                throw new AppError("Nenhum pedido feito.");
            }   

            const separateOrders = await Promise.all(orders.map(async order => {
                const items = await knex("order_item")
                                   .where({ orders_id: order.id })
                return { order, items };
            }));                 
    
            return response.json({separateOrders});

         }else {
          const orders = await knex("orders")
                             .where({ user_id })
                             .whereNot({ status: "criando" })
                             .orderBy("created_at", "desc");
    
          if (orders.length === 0) {
             throw new AppError("Nenhum pedido feito.");
          }
    
          const separateOrders = await Promise.all(orders.map(async order => {
              const items = await knex("order_item")
                                 .where({ orders_id: order.id })
              return { order, items };
          }));

          return response.json({ separateOrders });
         }

    };
    
};

module.exports = OrdersController;
