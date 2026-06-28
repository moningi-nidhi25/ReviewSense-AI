function Card({
  title,
  description,
  image,
  sentiment,
  theme,
  action,
}) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-md max-w-sm dark:bg-gray-800 dark:border-gray-700">
      {image && (
        <img
          src={image}
          alt={title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">
          {title}
        </h2>

        <p className="text-gray-600 mb-4 dark:text-gray-300">
          {description}
        </p>

        {(sentiment || theme) && (
          <div className="flex justify-between mb-4">
            {sentiment && (
              <span className="rounded bg-green-100 px-3 py-1 text-sm text-green-700">
                {sentiment}
              </span>
            )}

            {theme && (
              <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
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