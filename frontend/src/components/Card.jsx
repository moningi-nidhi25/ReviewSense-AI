function Card({
  title,
  description,
  image,
  sentiment,
  theme,
  action,
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-line bg-card shadow-sm transition hover:shadow-md dark:border-line-dark dark:bg-card-dark">
      {image && (
        <img
          src={image}
          alt={title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-6">
        <h2 className="mb-2 font-display text-xl font-semibold text-ink dark:text-ink-dark">
          {title}
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">
          {description}
        </p>

        {(sentiment || theme) && (
          <div className="flex justify-between mb-4 gap-2">
            {sentiment && (
              <span className="rounded-full bg-forest/10 px-3 py-1 font-label text-xs uppercase tracking-wide text-forest dark:bg-forest-dark/10 dark:text-forest-dark">
                {sentiment}
              </span>
            )}

            {theme && (
              <span className="rounded-full border border-line px-3 py-1 font-label text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-ink-soft-dark">
                {theme}
              </span>
            )}
          </div>
        )}

        {action && action}
      </div>
    </div>
  );
}

export default Card;