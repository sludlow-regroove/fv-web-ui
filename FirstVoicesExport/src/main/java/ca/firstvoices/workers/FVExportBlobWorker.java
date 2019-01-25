package ca.firstvoices.workers;

import ca.firstvoices.utils.FVBlobRelocatorAccessor;
import ca.firstvoices.utils.FVExportWorkInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.nuxeo.ecm.core.api.*;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;
import org.nuxeo.runtime.api.Framework;

import javax.print.Doc;
import javax.security.auth.login.LoginContext;
import java.io.*;
import java.util.HashMap;

import static ca.firstvoices.utils.FVExportConstants.*;
import static ca.firstvoices.utils.FVExportUtils.*;

public class FVExportBlobWorker extends FVAbstractExportWork
{
    private static final Log log = LogFactory.getLog(FVExportWorker.class);


    @Override
    public String getCategory() {
        return BLOB_WORKER;
    }

    @Override
    public String getTitle() {
        return "Move an export file to blob and create a wrapper.";
    }

    public FVExportBlobWorker(String id, FVExportWorkInfo info )
    {
        super( id );
        super.setWorkInfo( info );
    }

    @Override
    public void work()
    {
        try
        {
            LoginContext lctx = Framework.login();
            CoreSession session = CoreInstance.openCoreSession("default");


            File file = new File(workInfo.filePath);
            FileBlob fileBlob = new FileBlob(file, "text/csv", "UTF-8" );

            // check if wrapper already exists
            DocumentModel wrapper = findWrapper( session );

            if( wrapper != null )
            {
                session.removeDocument( wrapper.getRef() );
            }

            String pathToNewDocument = getPathToChildInDialect(session, session.getDocument(new IdRef(workInfo.dialectGUID)), DIALECT_RESOURCES_TYPE );
            wrapper = session.createDocumentModel( pathToNewDocument, workInfo.fileName, "FVExport" );

            wrapper = session.createDocument(wrapper);

            wrapper.setPropertyValue( "fvexport:dialect",       workInfo.dialectGUID );
            wrapper.setPropertyValue( "fvexport:format",        workInfo.exportFormat );
            wrapper.setPropertyValue( "fvexport:query",         workInfo.exportQuery );
            wrapper.setPropertyValue( "fvexport:columns",       workInfo.columns.toString() );
            wrapper.setPropertyValue( "fvexport:workdigest",    workInfo.workDigest );
            wrapper.setPropertyValue( "fvexport:exportdigest",  workInfo.exportDigest );

            wrapper.setPropertyValue( "file:content", fileBlob );

            session.saveDocument( wrapper );
            session.save();

            lctx.logout();
            session.close();
        }
        catch ( Exception e)
        {
            e.printStackTrace();
        }
    }

    private DocumentModel findWrapper( CoreSession session)
    {
        DocumentModel wrapper = null;

        String wrapperQ = "SELECT * FROM FVExport WHERE ecm:ancestorId = '" + workInfo.resourcesFolderGUID + "' AND fvexport:workdigest = '" + workInfo.workDigest + "' AND fvexport:exportdigest = '" + workInfo.exportDigest + "'";
        DocumentModelList docs = session.query( wrapperQ );

        if( docs != null && docs.size() > 0)
        {
            wrapper = docs.get( 0 );
        }

        return wrapper;
    }
}
