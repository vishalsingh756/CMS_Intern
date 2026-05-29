import slugify from 'slugify';

export const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const getUniqueSlug = async (baseSlug, model, excludeId = null) => {
  let slug = baseSlug;
  let count = 1;

  const query = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  let existing = await model.findOne(query);

  while (existing) {
    slug = `${baseSlug}-${count}`;
    const newQuery = { slug };
    if (excludeId) {
      newQuery._id = { $ne: excludeId };
    }
    existing = await model.findOne(newQuery);
    count++;
  }

  return slug;
};

export const paginate = (page = 1, limit = 10) => {
  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    skip,
  };
};

export const sendResponse = (res, statusCode, success, message, data = null, pagination = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (pagination !== null) {
    response.pagination = pagination;
  }

  res.status(statusCode).json(response);
};
