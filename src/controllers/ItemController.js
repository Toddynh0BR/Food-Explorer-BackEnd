const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class ItemController {

    async addOrder(request, response) {
        const user_id = request.user.id;
        const { plate_id, quantity } = request.body;
        console.log(quantity)
    
            await knex.transaction(async trx => {
                const plate = await trx("plates").where({ id: plate_id }).first();
                const order = await trx("orders").where({ user_id, status: "criando" }).first();
    
                if (!plate) {
                    throw new AppError("Prato não encontrado");
                }
                if (!order) {
                    throw new AppError("Impossível adicionar item após pagamento.");
                }
                const platePrice = plate.price;
    
                const orderTotal = typeof order.total === 'string' ? parseFloat(order.total.replace(',', '.')) : order.total;
    
                const total = orderTotal + (platePrice * quantity);
    
                const order_item = {
                    user_id,
                    orders_id: order.id,
                    plate_id,
                    plate_img: plate.img,
                    plate_name: plate.name,
                    plate_price: plate.price,
                    quantity: quantity
                }
    
                await trx("order_item").insert(order_item);
    

               
                await trx("orders")
                    .update({ total })
                    .where({ user_id, status: "criando" });
    
                return response.json({ message: "Pedido atualizado com sucesso" });
            });
  
    }
    
    
    
    async removeOrder(request, response) {
        const { order_id, order_item_id } = request.body;
    
        console.log(order_id, order_item_id)
    
            await knex.transaction(async trx => {
                const order = await trx("orders").where({ id: order_id }).first();
                const order_item = await trx("order_item").where({ id: order_item_id }).first();
               
                if (!order_item) {
                    throw new AppError("Item do pedido não encontrado.");
                }
                if (order.status !== "criando") {
                    throw new AppError("Impossível excluir item após pagamento.");
                }
    
                const orderTotal = typeof order.total === 'string' ? parseFloat(order.total.replace(',', '.')) : order.total;
    

                const platePrice = order_item.plate_price;
    

                const total = orderTotal - (platePrice * Number(order_item.quantity));
    

                const totalFormatted = total;
    
                await trx("orders")
                    .update({ total: totalFormatted })
                    .where({ id: order_id });
    
                await trx("order_item")
                    .where({ id: order_item_id })
                    .del();
    
                return response.json({ message: "Item removido e pedido atualizado com sucesso" });
            });
    };
    
    
};

module.exports = ItemController;
