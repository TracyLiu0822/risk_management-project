"""Create MVP users and chat history tables."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260607_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("student", "teacher", name="user_roles"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"], unique=False)

    op.create_table(
        "chat_history",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("sources_json", sa.Text(), nullable=False, server_default="[]"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_chat_history_id", "chat_history", ["id"], unique=False)
    op.create_index(
        "ix_chat_history_user_created_at",
        "chat_history",
        ["user_id", "created_at"],
        unique=False,
    )
    op.create_index("ix_chat_history_user_id", "chat_history", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_chat_history_user_id", table_name="chat_history")
    op.drop_index("ix_chat_history_user_created_at", table_name="chat_history")
    op.drop_index("ix_chat_history_id", table_name="chat_history")
    op.drop_table("chat_history")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    sa.Enum(name="user_roles").drop(op.get_bind(), checkfirst=True)
