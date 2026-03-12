use keyring::Entry;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn store_biometric_password(password: String) -> Result<String, String> {
    let entry = Entry::new("DogeGage Wallet", "biometric_password")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    entry.set_password(&password)
        .map_err(|e| format!("Failed to store password: {}", e))?;
    
    Ok("Password stored securely".to_string())
}

#[tauri::command]
async fn get_biometric_password() -> Result<String, String> {
    let entry = Entry::new("DogeGage Wallet", "biometric_password")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    entry.get_password()
        .map_err(|e| format!("Failed to retrieve password: {}", e))
}

#[tauri::command]
async fn delete_biometric_password() -> Result<String, String> {
    let entry = Entry::new("DogeGage Wallet", "biometric_password")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    entry.delete_password()
        .map_err(|e| format!("Failed to delete password: {}", e))?;
    
    Ok("Password deleted".to_string())
}

#[tauri::command]
async fn has_biometric_password() -> Result<bool, String> {
    let entry = Entry::new("DogeGage Wallet", "biometric_password")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            store_biometric_password,
            get_biometric_password,
            delete_biometric_password,
            has_biometric_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
