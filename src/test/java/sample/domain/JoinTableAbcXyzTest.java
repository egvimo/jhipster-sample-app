package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class JoinTableAbcXyzTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JoinTableAbcXyz.class);
        JoinTableAbcXyz joinTableAbcXyz1 = new JoinTableAbcXyz();
        joinTableAbcXyz1.setId(1L);
        JoinTableAbcXyz joinTableAbcXyz2 = new JoinTableAbcXyz();
        joinTableAbcXyz2.setId(joinTableAbcXyz1.getId());
        assertThat(joinTableAbcXyz1).isEqualTo(joinTableAbcXyz2);
        joinTableAbcXyz2.setId(2L);
        assertThat(joinTableAbcXyz1).isNotEqualTo(joinTableAbcXyz2);
        joinTableAbcXyz1.setId(null);
        assertThat(joinTableAbcXyz1).isNotEqualTo(joinTableAbcXyz2);
    }
}
