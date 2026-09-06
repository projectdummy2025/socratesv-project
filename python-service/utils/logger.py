from datetime import datetime

# Format timestamp according to AGENTS.md requirements: (YYYY-MM-DD HH:mm:ss)
def get_log_timestamp() -> str:
    return datetime.now().strftime("(%Y-%m-%d %H:%M:%S)")
