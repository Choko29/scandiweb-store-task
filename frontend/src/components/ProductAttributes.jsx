const toKebabCase = (str) => {
  return str.replace(/\s+/g, '-').toLowerCase();
};

function ProductAttributes({ attributes, selectedAttrs, handleAttributeSelect }) {
  return (
    <div className="pdp-attributes">
      {attributes.map((attr) => (
        <div key={attr.id} className="attribute-block" data-testid={`product-attribute-${toKebabCase(attr.name)}`}>
          <h3 className="attribute-name">{attr.name.toUpperCase()}:</h3>
          <div className="attribute-items">
            {attr.items.map((item) => {
              const isSelected = selectedAttrs[attr.name] === item.id;
              const isColor = attr.type === 'swatch';

              return (
                <button
                  key={item.id}
                  data-testid={`product-attribute-${toKebabCase(attr.name)}-${item.value}`}
                  className={`attr-btn ${isColor ? 'color-swatch' : 'text-swatch'} ${isSelected ? 'selected' : ''}`}
                  style={isColor ? { backgroundColor: item.value } : undefined}
                  onClick={() => handleAttributeSelect(attr.name, item.id)}
                >
                  {!isColor && item.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductAttributes;
