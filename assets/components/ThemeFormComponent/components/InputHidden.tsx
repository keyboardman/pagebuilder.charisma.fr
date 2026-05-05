export function InputHidden({ name, value }: { name: string; value: string }) {
  return (
    <input type="text" name={name} value={value} className="input input-bordered w-full mt-2" placeholder="style css" readOnly={true} />
  );
}