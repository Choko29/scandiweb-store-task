function ProductGallery({
  product,
  currentImgIndex,
  setCurrentImgIndex,
  handlePrevImage,
  handleNextImage,
}) {
  return (
    <div className="pdp-gallery-section" data-testid="product-gallery">
      <div className="pdp-thumbnails">
        {product.gallery.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Thumbnail ${index}`}
            className={currentImgIndex === index ? 'active-thumbnail' : ''}
            onClick={() => setCurrentImgIndex(index)}
          />
        ))}
      </div>
      <div className="pdp-main-image-container">
        <img
          src={product.gallery[currentImgIndex]}
          alt={product.name}
          className={`pdp-main-image ${!product.inStock ? 'oos-main-image' : ''}`}
          style={{ opacity: 1, visibility: 'visible' }}
        />
        {!product.inStock && (
          <div className="oos-overlay">
            <div className="oos-overlay-text">OUT OF STOCK</div>
          </div>
        )}
        {product.gallery.length > 1 && (
          <div className="pdp-image-arrows">
            <button onClick={handlePrevImage} className="arrow-btn">{'<'}</button>
            <button onClick={handleNextImage} className="arrow-btn">{'>'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGallery;
