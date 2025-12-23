from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials
import os

def get_drive_service(access_token):
    # Retrieve credentials from access token
    creds = Credentials(token=access_token)
    service = build('drive', 'v3', credentials=creds)
    return service

def upload_file_to_drive(access_token, file_path, filename, mime_type, folder_id=None):
    service = get_drive_service(access_token)
    
    file_metadata = {'name': filename}
    if folder_id:
        file_metadata['parents'] = [folder_id]
        
    media = MediaFileUpload(file_path, mimetype=mime_type)
    
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()
    
    return file.get('id')

def create_folder(access_token, folder_name, parent_id=None):
    service = get_drive_service(access_token)
    
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
        
    file = service.files().create(
        body=file_metadata,
        fields='id'
    ).execute()
    
    return file.get('id')
