import React from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  Button, 
  Stack, 
  Group,
  MultiSelect,
  Text
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faSave } from '@fortawesome/free-solid-svg-icons';
import { usePizzas } from '../../hooks/usePizzas';
import { Pizza, Topping } from '../../types';

interface PizzaFormProps {
  pizza?: Pizza;
  availableToppings: Topping[];
  onSuccess?: () => void;
}

const PizzaForm: React.FC<PizzaFormProps> = ({ 
  pizza, 
  availableToppings,
  onSuccess 
}) => {
  const { createPizza, updatePizza, loading } = usePizzas();

  const toppingOptions = availableToppings.map((topping: Topping) => ({
    value: topping.id.toString(),
    label: topping.formatted_price 
      ? `${topping.name} (${topping.formatted_price})`
      : topping.name,
  }));

  const form = useForm({
    initialValues: {
      name: pizza?.name || '',
      toppingIds: pizza?.toppings.map((t: Topping) => t.id.toString()) || [],
    },
    validate: {
      name: (value: string) => {
        if (!value.trim()) {
          return 'Pizza name is required';
        }
        if (value.trim().length < 2) {
          return 'Pizza name must be at least 2 characters';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: { name: string; toppingIds: string[] }) => {
    try {
      const toppingIds = values.toppingIds.map(id => parseInt(id));
      
      if (pizza) {
        await updatePizza(pizza.id, { 
          name: values.name.trim(),
          topping_ids: toppingIds
        });
      } else {
        await createPizza({ 
          name: values.name.trim(),
          topping_ids: toppingIds
        });
      }
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Pizza Name"
          placeholder="Enter pizza name (e.g., Margherita, Supreme)"
          leftSection={<FontAwesomeIcon icon={faPizzaSlice} />}
          required
          {...form.getInputProps('name')}
        />

        <div>
          <Text size="sm" fw={500} mb="xs">
            Select Toppings
          </Text>
          <MultiSelect
            placeholder="Choose toppings for your pizza"
            data={toppingOptions}
            searchable
            clearable
            hidePickedOptions
            {...form.getInputProps('toppingIds')}
          />
          <Text size="xs" c="dimmed" mt="xs">
            {availableToppings.length === 0 
              ? 'No toppings available. Add some toppings first.'
              : `${availableToppings.length} toppings available`
            }
          </Text>
        </div>

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={loading}
            leftSection={<FontAwesomeIcon icon={faSave} />}
          >
            {pizza ? 'Update Pizza' : 'Create Pizza'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default PizzaForm;
