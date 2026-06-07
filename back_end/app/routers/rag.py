"""RAG document management and retrieval routes."""

from fastapi import APIRouter, Depends, File, Query, UploadFile

from app.dependencies import get_current_teacher, get_current_user
from app.models.user import User
from app.services.rag_service import RAGService
from app.utils.response import create_response, error_response

router = APIRouter()


@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_teacher),
):
    try:
        result = await RAGService().upload_document(file)
        return create_response(data=result, status_code=201)
    except ValueError as exc:
        return error_response(str(exc), status_code=400)
    except (UnicodeDecodeError, OSError):
        return error_response("Document could not be processed", status_code=400)


@router.get("/search")
async def semantic_search(
    query: str = Query(..., min_length=2),
    limit: int = Query(5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
):
    retrieval = RAGService().search(query, limit=limit)
    return create_response(data=retrieval)


@router.get("/documents")
async def list_documents(current_user: User = Depends(get_current_teacher)):
    documents = RAGService().list_documents()
    return create_response(data={"documents": documents, "total": len(documents)})


@router.post("/retrieve-context")
async def retrieve_context(
    query: str = Query(..., min_length=2),
    limit: int = Query(5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
):
    retrieval = RAGService().search(query, limit=limit)
    return create_response(
        data={
            "query": query,
            "context": retrieval["context"],
            "sources": [
                {
                    "source_id": item["metadata"]["source"],
                    "title": item["metadata"]["title"],
                    "relevance_score": round(item["similarity"], 4),
                }
                for item in retrieval["results"]
            ],
        }
    )


@router.get("/index-status")
async def get_index_status(current_user: User = Depends(get_current_user)):
    documents = RAGService().list_documents()
    return create_response(
        data={
            "indexed_documents": len(documents),
            "index_ready": bool(documents),
        }
    )
