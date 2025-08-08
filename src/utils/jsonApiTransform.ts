import { JsonApiResponse, Pizza, Topping } from '../types';

/**
 * Transform JSON:API response to normalized Pizza objects
 */
export function transformPizzasFromJsonApi(response: JsonApiResponse): Pizza[] {
  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  // Create a map of included toppings for easy lookup
  const toppingsMap = new Map<string, Topping>();
  
  if (response.included) {
    response.included
      .filter(item => item.type === 'topping')
      .forEach(toppingResource => {
        const topping: Topping = {
          id: parseInt(toppingResource.id),
          name: toppingResource.attributes.name,
          price: toppingResource.attributes.price,
          formatted_price: toppingResource.attributes.formatted_price,
          created_at: toppingResource.attributes.created_at,
          updated_at: toppingResource.attributes.updated_at,
        };
        toppingsMap.set(toppingResource.id, topping);
      });
  }

  // Transform pizza data
  return response.data.map(pizzaResource => {
    const pizza: Pizza = {
      id: parseInt(pizzaResource.id),
      name: pizzaResource.attributes.name,
      description: pizzaResource.attributes.description,
      total_price: pizzaResource.attributes.total_price,
      topping_names: pizzaResource.attributes.topping_names,
      created_at: pizzaResource.attributes.created_at,
      updated_at: pizzaResource.attributes.updated_at,
      toppings: [],
    };

    // Add toppings from relationships
    if (pizzaResource.relationships?.toppings?.data) {
      const toppingRelationships = Array.isArray(pizzaResource.relationships.toppings.data) 
        ? pizzaResource.relationships.toppings.data 
        : [pizzaResource.relationships.toppings.data];
      
      pizza.toppings = toppingRelationships
        .map(ref => toppingsMap.get(ref.id))
        .filter((topping): topping is Topping => topping !== undefined);
    }

    return pizza;
  });
}

/**
 * Transform JSON:API response to normalized Topping objects
 */
export function transformToppingsFromJsonApi(response: JsonApiResponse): Topping[] {
  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map(toppingResource => ({
    id: parseInt(toppingResource.id),
    name: toppingResource.attributes.name,
    price: toppingResource.attributes.price,
    formatted_price: toppingResource.attributes.formatted_price,
    created_at: toppingResource.attributes.created_at,
    updated_at: toppingResource.attributes.updated_at,
  }));
}

/**
 * Transform single JSON:API pizza resource
 */
export function transformSinglePizzaFromJsonApi(response: JsonApiResponse): Pizza | null {
  if (!response.data) {
    return null;
  }

  // Handle single resource response (not in an array)
  if (!Array.isArray(response.data)) {
    const pizzaResource = response.data;
    
    // Create a map of included toppings for easy lookup
    const toppingsMap = new Map<string, Topping>();
    
    if (response.included) {
      response.included
        .filter(item => item.type === 'topping')
        .forEach(toppingResource => {
          const topping: Topping = {
            id: parseInt(toppingResource.id),
            name: toppingResource.attributes.name,
            price: toppingResource.attributes.price,
            formatted_price: toppingResource.attributes.formatted_price,
            created_at: toppingResource.attributes.created_at,
            updated_at: toppingResource.attributes.updated_at,
          };
          toppingsMap.set(toppingResource.id, topping);
        });
    }

    const pizza: Pizza = {
      id: parseInt(pizzaResource.id),
      name: pizzaResource.attributes.name,
      description: pizzaResource.attributes.description,
      total_price: pizzaResource.attributes.total_price,
      topping_names: pizzaResource.attributes.topping_names,
      created_at: pizzaResource.attributes.created_at,
      updated_at: pizzaResource.attributes.updated_at,
      toppings: [],
    };

    // Add toppings from relationships
    if (pizzaResource.relationships?.toppings?.data) {
      const toppingRelationships = Array.isArray(pizzaResource.relationships.toppings.data) 
        ? pizzaResource.relationships.toppings.data 
        : [pizzaResource.relationships.toppings.data];
      
      pizza.toppings = toppingRelationships
        .map(ref => toppingsMap.get(ref.id))
        .filter((topping): topping is Topping => topping !== undefined);
    }

    return pizza;
  }

  // Handle array response (fallback to existing logic)
  const pizzas = transformPizzasFromJsonApi(response);
  return pizzas.length > 0 ? pizzas[0] : null;
}

/**
 * Transform single JSON:API topping resource
 */
export function transformSingleToppingFromJsonApi(response: JsonApiResponse): Topping | null {
  if (!response.data) {
    return null;
  }

  // Handle single resource response (not in an array)
  if (!Array.isArray(response.data)) {
    const toppingResource = response.data;
    return {
      id: parseInt(toppingResource.id),
      name: toppingResource.attributes.name,
      price: toppingResource.attributes.price,
      formatted_price: toppingResource.attributes.formatted_price,
      created_at: toppingResource.attributes.created_at,
      updated_at: toppingResource.attributes.updated_at,
    };
  }

  // Handle array response (fallback to existing logic)
  const toppings = transformToppingsFromJsonApi(response);
  return toppings.length > 0 ? toppings[0] : null;
}
