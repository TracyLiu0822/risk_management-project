from pathlib import Path

from RAG.retriever import Retriever


def test_retriever_returns_grounded_source(tmp_path: Path):
    (tmp_path / "market_risk.md").write_text(
        "VaR 描述给定置信水平和持有期下的最大预期损失。"
        "它不能完整描述超过阈值后的尾部损失。",
        encoding="utf-8",
    )

    result = Retriever(material_dir=tmp_path).retrieve("VaR 有什么局限")

    assert result["results"]
    assert result["results"][0]["metadata"]["source"] == "market_risk.md"
    assert "尾部损失" in result["context"]


def test_retriever_returns_empty_for_unrelated_question(tmp_path: Path):
    (tmp_path / "credit.md").write_text("信用风险关注交易对手违约。", encoding="utf-8")

    result = Retriever(material_dir=tmp_path).retrieve("量子物理")

    assert result["results"] == []
