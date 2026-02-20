# Demo Version Notes

## What Has Been Changed

This is a demo version of the Murf Desktop application prepared for public GitHub sharing. The following changes have been made to protect intellectual property while showcasing the project structure:

### 1. Code Structure Preserved
- All file structure and organization remains intact
- API routes and endpoints are documented
- Component structure is visible
- Database models are documented

### 2. Implementation Code Removed
- **Backend**: All business logic and implementation code in API views has been replaced with placeholder responses
- **Frontend Services**: API service implementations simplified to show structure only
- **Shopify Service**: All Shopify integration code removed, function signatures preserved
- **Order Processing**: Complex order processing and export logic removed

### 3. Sensitive Information Removed
- Database credentials removed from settings.py
- API keys and secrets removed (using environment variables)
- JWT signing keys removed
- MongoDB connection strings removed

### 4. Icons Removed
- All icon imports removed from components
- Logo references removed
- Icon file references removed from Electron main process

### 5. Documentation Added
- Comprehensive README.md with:
  - Complete API route documentation
  - Frontend route documentation
  - Major function descriptions
  - Database model descriptions
  - Installation instructions

## What Still Works

- Project structure is visible
- Code organization can be reviewed
- API endpoint definitions are present
- Component structure is intact
- Routing configuration is visible

## What Doesn't Work

- API endpoints return demo/disabled responses
- Database connections are not configured
- Shopify integration is disabled
- Order processing is disabled
- Export functionality is disabled
- Authentication is disabled

## For Full Version

To obtain the full working version with all functionality, please contact the development team.

## Files Modified

### Backend
- `murf_panel/shop_api/views/*.py` - All view implementations simplified
- `murf_panel/shop_api/shopify_service.py` - Implementation removed
- `murf_panel/murf_panel/settings.py` - Sensitive data removed

### Frontend
- `murf_panel/frontend/src/services/*.js` - Service implementations simplified
- `murf_panel/frontend/src/components/Sidebar.js` - Icons removed

### Electron
- `main.js` - Icon references removed

### Documentation
- `README.md` - Comprehensive documentation added
