import React from 'react';

export default function InputField({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  options = [],
  rows = 3,
  error = '',
  required = false,
  disabled = false,
  style = {},
  ...props
}) {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className="form-group" style={{ width: '100%', ...style }}>
      {label && (
        <label className="form-label" style={{ display: 'flex', gap: '4px' }}>
          {label}
          {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      {isSelect ? (
        <select
          className="form-input"
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '15px',
            paddingRight: '40px',
            borderColor: error ? 'var(--danger)' : 'var(--border-color)',
            ...props.style
          }}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          disabled={disabled}
          style={{
            borderColor: error ? 'var(--danger)' : 'var(--border-color)',
            resize: 'vertical',
            ...props.style
          }}
          {...props}
        />
      ) : (
        <input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            borderColor: error ? 'var(--danger)' : 'var(--border-color)',
            ...props.style
          }}
          {...props}
        />
      )}

      {error && (
        <span style={styles.errorText}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}

const styles = {
  errorText: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--danger)',
    marginTop: '6px',
    fontWeight: '500'
  }
};
