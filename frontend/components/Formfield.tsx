import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

interface FormfieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type: "email" | "password" | "text";
}

const Formfield = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type,
}: FormfieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-lg font-semibold">{label}</FormLabel>
        <FormControl>
          <Input
            className="p-3 text-lg font-semibold"
            placeholder={placeholder}
            type={type}
            {...field}
          ></Input>
        </FormControl>
      </FormItem>
    )}
  />
);

export default Formfield;
