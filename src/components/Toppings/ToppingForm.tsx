import React from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  Button, 
  Stack, 
  Group 
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faSave, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useToppings } from '../../hooks/useToppings';
import { Topping } from '../../types';
import { validatePrice, validateToppingName, formatPriceInput } from '../../utils/validation';

interface ToppingFormProps {
  topping?: Topping;
  onSuccess?: () => void;
}

const ToppingForm: React.FC<ToppingFormProps> = ({ 
  topping, 
  onSuccess 
}) => {
  const { createTopping, updateTopping, loading } = useToppings();

  const form = useForm({
    initialValues: {
      name: topping?.name || '',
      price: topping?.price || '',
    },
    validate: {
      name: validateToppingName,
      price: validatePrice,
    },
  });

  const handleSubmit = async (values: { name: string; price: string }) => {
    try {
      if (topping) {
        await updateTopping(topping.id, { 
          name: values.name.trim(),
          price: values.price.trim()
        });
      } else {
        await createTopping({ 
          name: values.name.trim(),
          price: values.price.trim()
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
          label="Topping Name"
          placeholder="Enter topping name (e.g., Pepperoni, Mushrooms)"
          leftSection={<FontAwesomeIcon icon={faLeaf} />}
          required
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Price ($)"
          placeholder="Enter price (e.g., 2.99)"
          leftSection={<FontAwesomeIcon icon={faDollarSign} />}
          required
          {...form.getInputProps('price')}
          onChange={(event) => {
            const formattedValue = formatPriceInput(event.currentTarget.value);
            form.setFieldValue('price', formattedValue);
          }}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={loading}
            leftSection={<FontAwesomeIcon icon={faSave} />}
          >
            {topping ? 'Update Topping' : 'Create Topping'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ToppingForm;
