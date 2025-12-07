import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange: (note: string) => void;
  value?: string;
}

function SearchBox({ onChange, value }: SearchBoxProps) {
  return (
    <input
      onChange={(e) => onChange(e.target.value.trim())}
      className={css.input}
      type="text"
      defaultValue={value}
      placeholder="Search notes"
    />
  );
}

export default SearchBox;
