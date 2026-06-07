"""
Back-end Application Package
Risk Management Platform API
"""

import sys
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

__version__ = "1.0.0"
__author__ = "Chen Hanzheng, Liu Yuxuan"
__description__ = "AI-powered platform for financial risk management education"
