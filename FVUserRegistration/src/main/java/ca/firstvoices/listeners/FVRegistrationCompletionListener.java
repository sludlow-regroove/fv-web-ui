package ca.firstvoices.listeners;

import static ca.firstvoices.utils.FVRegistrationConstants.GROUP_NAME_ARG;
import static ca.firstvoices.utils.FVRegistrationConstants.INVITATION_VALIDATED;
import static ca.firstvoices.utils.FVRegistrationConstants.LADMIN_APPROVED_GROUP_CHANGE;
import static ca.firstvoices.utils.FVRegistrationConstants.SYSTEM_APPROVED_GROUP_CHANGE;
import static ca.firstvoices.utils.FVRegistrationConstants.USER_NAME_ARG;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.nuxeo.ecm.core.api.DocumentModel;
import org.nuxeo.ecm.core.event.Event;
import org.nuxeo.ecm.core.event.EventContext;
import org.nuxeo.ecm.core.event.EventListener;
import org.nuxeo.ecm.core.event.impl.DocumentEventContext;

import ca.firstvoices.services.FVMoveUserToDialectServiceImpl;
import ca.firstvoices.utils.FVRegistrationUtilities;

/**
 *
 */
public class FVRegistrationCompletionListener implements EventListener {

    private static final Log log = LogFactory.getLog(ca.firstvoices.listeners.FVRegistrationCompletionListener.class);

    // accepts documentRemoved && registrationValidated

    @Override
    public void handleEvent(Event event) {
        EventContext ctx;
        ctx = event.getContext();
        if (!(ctx instanceof DocumentEventContext))
            return;

        DocumentEventContext docCtx = (DocumentEventContext) ctx;

        FVRegistrationUtilities regUtil = new FVRegistrationUtilities();
        FVMoveUserToDialectServiceImpl util = new FVMoveUserToDialectServiceImpl();
        Object[] args;
        DocumentModel dialect;

        switch (event.getName()) {
        // TODO: this event is not triggered yet
        // TODO: should be triggered when administrator approves a member to join Private (Enabled) dialect.
        case LADMIN_APPROVED_GROUP_CHANGE: // <event>newUserApprovedByLanguageAdministrator</event>
            dialect = docCtx.getSourceDocument();

            try {
                util.placeNewUserInGroup(dialect, (String) docCtx.getProperty(GROUP_NAME_ARG),
                        (String) docCtx.getProperty(USER_NAME_ARG));
            } catch (Exception e) {
                log.error(e);
            }
            break;

        // this is in case of users joining Published dialects ie. Public
        case SYSTEM_APPROVED_GROUP_CHANGE:
            dialect = docCtx.getSourceDocument();

            try {
                util.systemPlaceNewUserInGroup(dialect, (String) docCtx.getProperty(GROUP_NAME_ARG),
                        (String) docCtx.getProperty(USER_NAME_ARG), dialect.getCoreSession());
            } catch (Exception e) {
                log.error(e);
            }
            break;

        case "documentRemoved":
            // TODO: use it to make sure user name is not left in the system when registration is deleted on timeout
            break;

        case INVITATION_VALIDATED:
            args = docCtx.getArguments();

            for (Object o : args) {
                if (o == null)
                    break;

                DocumentModel ureg = (DocumentModel) o;
                String cArg = ureg.getType();

                if (cArg.equals("FVUserRegistration")) {
                    regUtil.registrationValidationHandler(ureg.getRef(), ureg.getCoreSession());
                }
            }
            break;
        }
    }
}