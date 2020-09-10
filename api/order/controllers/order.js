"sk_test_51HP5sRI0VhEiqKG6qQTwSiE3RLhEYIc55crLTKMPZO5phDFuXdNLaXIF5MNscK2DJOfkUFg01LXP5KuwVEpX458n00C843sUY7";

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const stripe = require("stripe")("YOUR STRIPE SECRET KEY");

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(
      ctx.request.body
    );
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};