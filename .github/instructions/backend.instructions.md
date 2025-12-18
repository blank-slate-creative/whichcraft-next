---
description: Backend code style and conventions guide
name: Backend Instructions
applyTo: apps/api/**/*,packages/**/*.py
---
### 📎 Style & Conventions
- **Use Python** as the primary language for the backend.
- **Follow PEP8**, use type hints, and format with `black`.
- **Use `pydantic` for data validation**.
- Use `FastAPI` for APIs and `SQLAlchemy` or `SQLModel` for ORM if applicable.
- Write **docstrings for every function** using the Google style:
  ```python
  def example():
      """
      Brief summary.

      Args:
          param1 (type): Description.

      Returns:
          type: Description.
      """
  ```